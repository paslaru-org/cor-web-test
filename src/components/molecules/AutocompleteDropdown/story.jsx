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
import { storiesOf } from '@storybook/react'
import AutocompleteDropdown from '.'

const generateItem = (item: string, value?: string) => {
  return {
    value: value || item.replace(/ /g, '_').toLowerCase(),
    label: item,
  }
}

const items = [
  generateItem('Item 1'),
  generateItem('Item 2'),
  generateItem('Item 3'),
  generateItem('Item 4'),
  generateItem('Item 5'),
  generateItem('Item 6'),
  generateItem('Item 7'),
  generateItem('Item 8'),
  generateItem('Item 8', 'item_8_2'),
]

type State = {
  selectedItem: string,
}

class Wrapper extends React.Component<{}, State> {
  state = {
    selectedItem: '',
  }

  render() {
    return (
      <AutocompleteDropdown
        items={items}
        selectedItem={this.state.selectedItem}
        onChange={selectedItem => { this.setState({ selectedItem }) }}
        onInputChange={(value, filteredItems) => {
          if (filteredItems.length === 0) {
            console.log('input value', value)
          }
        }}
      />
    )
  }
}

storiesOf('AutocompleteDropdown', module)
  .add('default', () => (
    <Wrapper />
  ))