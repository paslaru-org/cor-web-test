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

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './WizardSummary.scss';
import moment from 'moment';
import TextTruncate from 'react-text-truncate';
import InfoIcon from '../InfoIcon';


const title = 'Summary';

class WizardSummary extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    setWizardState: PropTypes.func,
    summary: PropTypes.object,

  }

  constructor(props) {
    super(props)
    this.dateTypes = ["One time"]
    this.state = {
      valid: true,
      currentStep: "WizardSummary"
    }
  }

  componentWillMount() {
    this.props.setWizardState(this.state)
    this.context.onSetTitle(title);
  }

  render() {
    let schedules = this.props.summary.schedules.map((item, index) => (
        <div className="item" key={"schedule_" + index}>
          <span className="cell">
            {this.dateTypes.indexOf(item.type) == -1 ? item.type : moment(item.date).format("MMM Do YYYY")}
          </span>
          <span className="cell">
            {item.hour.label + ":" + item.minute.label + " " + item.tod + " " + item.timezone}
          </span>
        </div>
      ), this)

    let instances = this.props.summary.selectedInstances.map((vm, index) => {
      return (
        <div className="item" key={"VM_" + index}>
          <span className="cell">
            <TextTruncate line={1} text={vm.name} truncateText="..." />
          </span>
          <span className="cell">
            {vm.num_cpu} vCPU | {vm.memory_mb} MB RAM
          </span>
          {/*            <span className="cell">
           {vm.status}
           </span>*/}
        </div>
      )

    })
    let networks = this.props.summary.networks.map((network, index) => {
      if (network.selected || true) {
        return (
          <div className="item" key={"Network_" + index}>
            <span className="cell">
              <TextTruncate line={1} text={network.name} truncateText="..." />
            </span>
            <span className="cell">
              <div className="arrow"></div>
            </span>
            <span className="cell">
              <TextTruncate
                line={1}
                text={network.migrateNetwork ? network.migrateNetwork : "Create new"}
                truncateText="..."
              />
            </span>
          </div>
        )
      } else {
        return null
      }
    })
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.columnLeft}>
            <div className={s.group}>
              <h3>
                Migration
                <InfoIcon text="Helptext" />
              </h3>
              <div className={s.values}>
                {/*<div className={s.row}><span>Name:</span><span>{this.props.summary.migrationName}</span></div>*/}
                <div className={s.row}>
                  <span>Source: <br /> </span>
                  <span>
                    <span className={s.cloudBox}>{this.props.summary.sourceCloud.name}</span> <br />
                    {this.props.summary.sourceCloud.credential.name}
                  </span>
                </div>
                <div className={s.row}>
                  <span>Target:</span>
                  <span>
                    <span className={s.cloudBox}>{this.props.summary.targetCloud.name}</span> <br />
                    {this.props.summary.targetCloud.credential.name}
                  </span>
                </div>
              </div>
            </div>
            <div className={s.group}>
              <h3>
                Options
                <InfoIcon text="Helptext" />
              </h3>
              <div className={s.values}>
                <div className={s.row + " " + s.migrationType + " " + this.props.summary.migrationType}>
                  <span>Type:</span>
                  <span>
                    {this.props.summary.migrationType == "replica" ? "Coriolis Replica" : "Coriolis Migration"}
                  </span>
                </div>
                <div className={s.row}>
                  <span>Flavour:</span>
                  <span>{this.props.summary.sourceCloud.autoFlavors ?
                    "Automatic Flavor Selection" : "Manual Flavor Selection"}</span>
                </div>
                <div className={s.row}><span>FIP Pool:</span><span>{this.props.summary.fipPool}</span></div>
              </div>
            </div>
            <div className={s.group}>
              <h3>
                Schedule
                <InfoIcon text="Helptext" />
              </h3>
              <div className={s.instances + " items-list"}>
                {schedules}
              </div>
            </div>
          </div>
          <div className={s.columnRight}>
            <div className={s.group}>
              <h3>
                Instances
                <InfoIcon text="Helptext" />
              </h3>
              <div className={s.instances + " items-list"}>
                {instances}
              </div>
            </div>
            <div className={s.group}>
              <h3>
                Networks
                <InfoIcon text="Helptext" />
              </h3>
              <div className={s.networks + " items-list"}>
                {networks}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default withStyles(WizardSummary, s);