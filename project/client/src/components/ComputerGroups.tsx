import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createComputerGroup, deleteComputerGroup, getComputerGroups, patchComputerGroup } from '../api/computer-groups-api'
import Auth from '../auth/Auth'
import { ComputerGroup } from '../types/ComputerGroup'

interface ComputerGroupsProps {
  auth: Auth
  history: History
}

interface ComputerGroupsState {
  computerGroups: ComputerGroup[]
  newComputerGroupName: string
  newDescription: string
  loadingComputerGroups: boolean
}

export class ComputerGroups extends React.PureComponent<ComputerGroupsProps, ComputerGroupsState> {
  state: ComputerGroupsState = {
    computerGroups: [],
    newComputerGroupName: '',
    newDescription: '',
    loadingComputerGroups: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newComputerGroupName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value })
  }

  onEditButtonClick = (computerGroupId: string) => {
    this.props.history.push(`/computerGroups/${computerGroupId}/edit`)
  }

  onComputerGroupCreate = async () => {
    try {
      const newComputerGroup = await createComputerGroup(this.props.auth.getIdToken(), {
        name: this.state.newComputerGroupName,
        description: this.state.newDescription
      })
      console.log(newComputerGroup)
      this.setState({
        computerGroups: [...this.state.computerGroups, newComputerGroup],
        newComputerGroupName: ''
      })
    } catch {
      alert('ComputerGroup creation failed')
    }
  }

  onComputerGroupDelete = async (computerGroupId: string) => {
    try {
      await deleteComputerGroup(this.props.auth.getIdToken(), computerGroupId)
      this.setState({
        computerGroups: this.state.computerGroups.filter(computerGroup => computerGroup.computerGroupId !== computerGroupId)
      })
    } catch {
      alert('ComputerGroup deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const computerGroups = await getComputerGroups(this.props.auth.getIdToken())
      console.log()
      this.setState({
        computerGroups,
        loadingComputerGroups: false
      })
    } catch (e) {
      alert(`Failed to fetch computerGroups: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">COMPUTER GROUPS</Header>

        {this.renderCreateComputerGroupInput()}
        {this.renderComputerGroups()}
      </div>
    )
  }

  renderCreateComputerGroupInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Computer name"
            onChange={this.handleNameChange}
          />

        </Grid.Column>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Computer description"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Button color='blue' onClick={() => this.onComputerGroupCreate()}>
            CREATE
          </Button>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderComputerGroups() {
    if (this.state.loadingComputerGroups) {
      return this.renderLoading()
    }

    return this.renderComputerGroupsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading COMPUTERGROUP's
        </Loader>
      </Grid.Row>
    )
  }

  renderComputerGroupsList() {
    return (
      <Grid padded>
        {this.state.computerGroups.map((computerGroup, pos) => {
          return (
            <Grid.Row key={computerGroup.computerGroupId}>
              <Grid.Column width={3} verticalAlign="top">
                <h5>{computerGroup.name}</h5>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {computerGroup.description}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {computerGroup.attachmentUrl && (
                  <Image src={computerGroup.attachmentUrl} onError={(event: { target: { style: { display: string } } }) => event.target.style.display = 'none'} alt=" This is computer image!" size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {computerGroup.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(computerGroup.computerGroupId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onComputerGroupDelete(computerGroup.computerGroupId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
