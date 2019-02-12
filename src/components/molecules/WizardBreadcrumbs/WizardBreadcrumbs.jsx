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
import { observer } from 'mobx-react'
import styled from 'styled-components'

import Arrow from '../../atoms/Arrow'

import { wizardConfig } from '../../../config'
import Palette from '../../styleUtils/Palette'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`
const ArrowStyled = styled(Arrow)``
const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  margin-right: 6px;

  &:last-child ${ArrowStyled} {
    display: none;
  }
`
const Name = styled.div`
  color: ${props => props.selected ? Palette.primary : Palette.black};
`

type Props = {
  selected: { id: string },
  wizardType: 'migration' | 'replica',
  destinationProvider: ?string,
  sourceProvider: ?string,
}
@observer
class WizardBreadcrumbs extends React.Component<Props> {
  render() {
    let pages = wizardConfig.pages
      .filter(p => !p.excludeFrom || p.excludeFrom !== this.props.wizardType)
      .filter(p => !p.targetFilter || (this.props.destinationProvider && p.targetFilter(this.props.destinationProvider)))
      .filter(p => !p.sourceFilter || (this.props.sourceProvider && p.sourceFilter(this.props.sourceProvider)))

    return (
      <Wrapper>
        {pages.map(page => {
          return (
            <Breadcrumb key={page.id}>
              <Name selected={this.props.selected.id === page.id} data-test-id={`wBreadCrumbs-name-${page.id}`}>{page.breadcrumb}</Name>
              <ArrowStyled primary={this.props.selected.id === page.id} useDefaultCursor />
            </Breadcrumb>
          )
        })}
      </Wrapper>
    )
  }
}

export default WizardBreadcrumbs
