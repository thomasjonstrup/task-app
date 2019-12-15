import React, { PureComponent } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import styled from 'styled-components';
import Task from './task';

const Container = styled.div`
	margin: 8px;
	border: 1px solid lightgrey;
	background-color: ${props => (props.darkmode ? '#17223b' : 'white')};
	border-radius: 2px;
	width: 220px;
	color: #6b778d;
	display: flex;
	flex-direction: column;
`;
const Title = styled.h3`
	padding: 8px;
	color: ${props => (props.darkmode ? '#ff6768' : '#172B4D;')};
`;
const TaskList = styled.div`
	padding: 8px;
	transition: background-color 0.2s ease;
	background-color: ${props =>
		props.isDraggingOver ? 'skyblue' : 'inherit'};
	flex-grow: 1;
	min-height: 100px;
`;

export default class Column extends PureComponent {
	render() {
		return (
			<Draggable
				draggableId={this.props.column.id}
				index={this.props.index}
			>
				{provided => (
					<Container
						{...provided.draggableProps}
						darkmode={this.props.darkmode}
						ref={provided.innerRef}
					>
						<Title
							{...provided.dragHandleProps}
							darkmode={this.props.darkmode}
						>
							{this.props.column.title}
						</Title>
						<Droppable
							droppableId={this.props.column.id}
							type='task'
							/*type={
						this.props.column.id === 'column-3' ? 'done' : 'active'
					}*/
							isDropDisabled={this.props.isDropDisabled}
						>
							{/* Droppable expects a function to be returned */
							(provided, snapshot) => (
								<TaskList
									ref={provided.innerRef}
									{...provided.droppableProps}
									isDraggingOver={snapshot.isDraggingOver}
								>
									{this.props.tasks.map((task, index) => (
										<Task
											key={task.id}
											task={task}
											darkmode={this.props.darkmode}
											index={index}
										/>
									))}
									{provided.placeholder}
								</TaskList>
							)}
						</Droppable>
					</Container>
				)}
			</Draggable>
		);
	}
}
