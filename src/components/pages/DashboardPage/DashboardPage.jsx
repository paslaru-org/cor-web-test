/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// @flow

import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import replicaStore from '../../../stores/ReplicaStore'
import migrationStore from '../../../stores/MigrationStore'
import endpointStore from '../../../stores/EndpointStore'
import userStore from '../../../stores/UserStore'
import projectStore from '../../../stores/ProjectStore'
import licenceStore from '../../../stores/LicenceStore'
import notificationStore from '../../../stores/NotificationStore'

import MainTemplate from '../../templates/MainTemplate'
import Navigation from '../../organisms/Navigation'
import PageHeader from '../../organisms/PageHeader'
import DashboardContent from '../../organisms/DashboardContent'

import Utils from '../../../utils/ObjectUtils'
import configLoader from '../../../utils/Config'

const Wrapper = styled.div``

type State = {
  modalIsOpen: boolean,
}
@observer
class ProjectsPage extends React.Component<{ history: any }, State> {
  state = {
    modalIsOpen: false,
  }
  pageHeaderRef: PageHeader
  pollTimeout: TimeoutID
  stopPolling: boolean

  componentDidMount() {
    document.title = 'Dashboard'

    this.stopPolling = false
    this.pollData(true)
  }

  componentWillUnmount() {
    clearTimeout(this.pollTimeout)
    this.stopPolling = true
  }

  async handleProjectChange() {
    this.stopPolling = true
    clearTimeout(this.pollTimeout)
    await this.loadData(true)
    this.pollData(false)
  }

  handleModalOpen() {
    this.setState({ modalIsOpen: true })
  }

  handleModalClose() {
    this.setState({ modalIsOpen: false }, () => {
      this.pollData(false)
    })
  }

  handleNewEndpointClick() {
    this.pageHeaderRef.handleNewItem('endpoint')
  }

  async pollData(showLoading: boolean) {
    if (this.state.modalIsOpen || this.stopPolling) {
      return
    }

    await this.loadData(showLoading)
    this.pollTimeout = setTimeout(() => { this.pollData(false) }, configLoader.config.requestPollTimeout)
  }

  async loadData(showLoading: boolean) {
    this.loadAdminData(showLoading)

    await Promise.all([
      replicaStore.getReplicas({ skipLog: true, showLoading }),
      migrationStore.getMigrations({ skipLog: true, showLoading }),
      endpointStore.getEndpoints({ skipLog: true, showLoading }),
      projectStore.getProjects({ skipLog: true, showLoading }),
      licenceStore.loadLicenceInfo({ skipLog: true, showLoading }),
    ])
  }

  async loadAdminData(showLoading: boolean) {
    await Utils.waitFor(() => Boolean(userStore.loggedUser && userStore.loggedUser.isAdmin), 3000, 100)
    if (userStore.loggedUser && userStore.loggedUser.isAdmin) {
      await userStore.getAllUsers({ skipLog: true, showLoading })
    }
  }

  render() {
    return (
      <Wrapper>
        <MainTemplate
          navigationComponent={<Navigation currentPage="dashboard" />}
          listNoMargin
          listComponent={(
            <DashboardContent
              replicas={replicaStore.replicas}
              migrations={migrationStore.migrations}
              endpoints={endpointStore.endpoints}
              users={userStore.users}
              projects={projectStore.projects}
              licence={licenceStore.licenceInfo}
              isAdmin={Boolean(userStore.loggedUser && userStore.loggedUser.isAdmin)}
              notificationItems={notificationStore.notificationItems}
              notificationItemsLoading={notificationStore.loading}
              endpointsLoading={endpointStore.loading}
              migrationsLoading={migrationStore.loading}
              projectsLoading={projectStore.projects.length === 0}
              usersLoading={userStore.users.length === 0}
              licenceLoading={licenceStore.loadingLicenceInfo}
              replicasLoading={replicaStore.loading}
              onNewReplicaClick={() => { this.props.history.push('/wizard/replica') }}
              onNewEndpointClick={() => { this.handleNewEndpointClick() }}
            />
          )}
          headerComponent={
            <PageHeader
              title="Dashboard"
              onModalOpen={() => { this.handleModalOpen() }}
              onModalClose={() => { this.handleModalClose() }}
              onProjectChange={() => { this.handleProjectChange() }}
              componentRef={ref => { this.pageHeaderRef = ref }}
            />
          }
        />
      </Wrapper>
    )
  }
}

export default ProjectsPage
