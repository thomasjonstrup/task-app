import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import initialData from './data/initialData';
import Column from './components/column';

const Container = styled.div`
	display: flex;
	background-color: ${props => (props.darkmode ? '#17223b' : 'white')};
`;

class App extends PureComponent {
	state = {
		enterText: '',
		darkMode: false,
		homeIndex: null
	};

	componentDidMount() {
		if (!localStorage.getItem('myTodoStorage')) {
			localStorage.setItem('myTodoStorage', JSON.stringify(initialData));
		}
	}

	onChange = event => {
		this.setState({
			enterText: event.target.value
		});
	};

	handleClick = event => {
		const localState = JSON.parse(localStorage.getItem('myTodoStorage'));
		const newState = Object.assign({}, this.state);

		const id =
			'newtask' +
			'_' +
			Math.random()
				.toString(36)
				.substr(2, 9);

		localState.tasks[id] = {
			id: id,
			content: this.state.enterText
		};

		localState.columns['column-1'].taskIds.push(id);

		newState.enterText = '';

		localStorage.setItem('myTodoStorage', JSON.stringify(localState));

		this.setState(newState);
	};

	onDragStart = start => {
		const localState = JSON.parse(localStorage.getItem('myTodoStorage'));
		const homeIndex = localState.columnOrder.indexOf(
			start.source.droppableId
		);

		this.setState({
			homeIndex
		});

		document.body.style.color = 'orange';
		document.body.style.transition = 'background-color 0.2 ease';
	};

	onDragUpdate = update => {
		const localState = JSON.parse(localStorage.getItem('myTodoStorage'));
		const { destination } = update;
		const opacity = destination
			? destination.index / Object.keys(localState.tasks).length
			: 0;

		document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
	};

	onDragEnd = result => {
		document.body.style.color = 'inherit';
		document.body.style.backgroundColor = 'inherit';

		const localState =
			JSON.parse(localStorage.getItem('myTodoStorage')) || initialData;

		this.setState({
			homeIndex: null
		});

		const { destination, source, draggableId, type } = result;

		if (!destination) {
			return;
		}

		if (
			destination.droppableId === source.droppabled &&
			destination.index === source.index // Check if destination and source are the same
		) {
			return;
		}

		if (type === 'column') {
			const newColumnOrder = Array.from(localState.columnOrder);
			newColumnOrder.splice(source.index, 1);
			newColumnOrder.splice(destination.index, 0, draggableId);

			const newState = {
				...localState,
				columnOrder: newColumnOrder
			};

			return localStorage.setItem(
				'myTodoStorage',
				JSON.stringify(newState)
			);
		}

		const start = localState.columns[source.droppableId];
		const finish = localState.columns[destination.droppableId];

		if (start === finish) {
			const newTaskIds = Array.from(start.taskIds);

			newTaskIds.splice(source.index, 1); // from source.index splice 1
			newTaskIds.splice(destination.index, 0, draggableId); // splice where we remove none and add one

			const newColumn = {
				...start,
				taskIds: newTaskIds
			};

			const newState = {
				...localState,
				columns: {
					...localState.columns,
					[newColumn.id]: newColumn
				}
			};

			return localStorage.setItem(
				'myTodoStorage',
				JSON.stringify(newState)
			);
		}

		// Moving from one list to another
		const startTaskIds = Array.from(start.taskIds);
		startTaskIds.splice(source.index, 1);
		const newStart = {
			...start,
			taskIds: startTaskIds
		};

		const finishTaskIds = Array.from(finish.taskIds);
		finishTaskIds.splice(destination.index, 0, draggableId);

		const newFinish = {
			...finish,
			taskIds: finishTaskIds
		};

		const newState = {
			...localState,
			columns: {
				...localState.columns,
				[newStart.id]: newStart,
				[newFinish.id]: newFinish
			}
		};

		return localStorage.setItem('myTodoStorage', JSON.stringify(newState)); //this.setState(newState);
	};

	render() {

		const localState =
			JSON.parse(localStorage.getItem('myTodoStorage')) || initialData;

		return (
			<Fragment>
				<Container darkmode={this.state.darkMode}>
					<DragDropContext
						onDragEnd={this.onDragEnd}
						onDragStart={this.onDragStart}
						onDragUpdate={this.onDragUpdate}
					>
						<Droppable
							droppableId='all-columns'
							direction='horizontal'
							type='column'
						>
							{provided => (
								<Container
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{localState.columnOrder.map(
										(columnId, index) => {
											const column =
												localState.columns[columnId];
											const tasks = column.taskIds.map(
												taskId =>
													localState.tasks[taskId]
											);

											const isDropDisabled =
												index < this.state.homeIndex;

											return (
												<Column
													key={column.id}
													column={column}
													tasks={tasks}
													isDropDisabled={
														isDropDisabled
													}
													darkmode={
														this.state.darkMode
													}
													index={index}
												/>
											);
										}
									)}
								</Container>
							)}
						</Droppable>
					</DragDropContext>
				</Container>
				<div>
					<input
						value={this.state.enterText}
						type='text'
						onChange={this.onChange}
					/>
					<button onClick={this.handleClick}>Save</button>
				</div>
			</Fragment>
		);
	}
}

export default App;
