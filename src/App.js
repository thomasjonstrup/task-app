import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import initialData from './data/initialData';
import Column from './components/column';

const Container = styled.div`
	display: flex;
`;

class App extends PureComponent {
	state = initialData;

	onDragStart = start => {
		const homeIndex = this.state.columnOrder.indexOf(
			start.source.droppableId
		);

		this.setState({
			homeIndex
		});

		document.body.style.color = 'orange';
		document.body.style.transition = 'background-color 0.2 ease';
	};

	onDragUpdate = update => {
		const { destination } = update;
		const opacity = destination
			? destination.index / Object.keys(this.state.tasks).length
			: 0;

		document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
	};

	onDragEnd = result => {
		document.body.style.color = 'inherit';
		document.body.style.backgroundColor = 'inherit';

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
			const newColumnOrder = Array.from(this.state.columnOrder);
			newColumnOrder.splice(source.index, 1);
			newColumnOrder.splice(destination.index, 0, draggableId);

			const newState = {
				...this.state,
				columnOrder: newColumnOrder
			};

			return this.setState(newState);
		}

		const start = this.state.columns[source.droppableId];
		const finish = this.state.columns[destination.droppableId];

		if (start === finish) {
			const newTaskIds = Array.from(start.taskIds);

			newTaskIds.splice(source.index, 1); // from source.index splice 1
			newTaskIds.splice(destination.index, 0, draggableId); // splice where we remove none and add one

			const newColumn = {
				...start,
				taskIds: newTaskIds
			};

			const newState = {
				...this.state,
				columns: {
					...this.state.columns,
					[newColumn.id]: newColumn
				}
			};

			return this.setState(newState);
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
			...this.state,
			columns: {
				...this.state.columns,
				[newStart.id]: newStart,
				[newFinish.id]: newFinish
			}
		};

		return this.setState(newState);
	};

	render() {
		return (
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
							{this.state.columnOrder.map((columnId, index) => {
								const column = this.state.columns[columnId];
								const tasks = column.taskIds.map(
									taskId => this.state.tasks[taskId]
								);

								const isDropDisabled =
									index < this.state.homeIndex;

								return (
									<Column
										key={column.id}
										column={column}
										tasks={tasks}
										isDropDisabled={isDropDisabled}
										index={index}
									/>
								);
							})}
						</Container>
					)}
				</Droppable>
			</DragDropContext>
		);
	}
}

export default App;
