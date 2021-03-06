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

import React from 'react'
import { storiesOf } from '@storybook/react'
import MainListItem from '.'

let item = {
  origin_endpoint_id: 'openstack',
  destination_endpoint_id: 'azure',
  instances: ['instance name'],
  executions: [{ status: 'COMPLETED', created_at: new Date() }],
}
let endpointType = id => id

storiesOf('MainListItem', module)
  .add('completed', () => (
    <MainListItem item={item} endpointType={endpointType} />
  ))
  .add('running', () => (
    <MainListItem
      item={{
        origin_endpoint_id: 'aws',
        destination_endpoint_id: 'opc',
        instances: ['instance name'],
        executions: [{ status: 'RUNNING', created_at: new Date() }],
      }}
      endpointType={endpointType}
    />
  ))
