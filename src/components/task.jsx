import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
	border: 1px solid lightgrey;
	border-radius: 2px;
	padding: 8px;
	margin-bottom: 8px;
	background-color: ${props =>
		props.isDragDisabled
			? 'lightgrey'
			: props.isDragging
			? 'lightgreen'
			: 'white'};
	display: flex;
`;

/*const Handle = styled.div`
	width: 20px;
	height: 20px;
	background-color: orange;
	border-radius: 4px;
	margin-right: 8px;
`;*/

class Task extends PureComponent {
	render() {
		const isDragDiasabled = this.props.task.id === 'task-1';

		return (
			<Draggable
				draggableId={this.props.task.id}
				index={this.props.index}
				isDragDisabled={isDragDiasabled}
			>
				{(provided, snapshot) => (
					<Container
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
						isDragging={snapshot.isDragging}
						isDragDisabled={isDragDiasabled}
					>
						{/* if you want only a handle to control drag <Handle {...provided.dragHandleProps} /> */}
						{this.props.task.content}
					</Container>
				)}
			</Draggable>
		);
	}
}

export default Task;
