import React, { Component } from 'react';

class TaskItem extends Component {
    onUpdateStatus = () => {
        this.props.onUpdateStatus(this.props.task.id);
    }

    onDelete = () => {
        this.props.onDelete(this.props.task.id);
    }

    onUpdate = () => {
        this.props.onUpdate(this.props.task.id);
    }

    render() {
        var {task, index} = this.props;
        return (
             <tr>
                <td> {index + 1} </td>
                <td className="text-center"> {task.name} </td>
                <td className="text-center">
                    <span onClick = {this.onUpdateStatus} className={task.status === true ? 'label label-danger' : 'label label-success'} >
                        { task.status === true ? 'Kích hoạt' : 'Không kích hoạt' }
                    </span>
                </td>
                <td className="text-center">
                     <button className="btn btn-warning">
                        <span className="fa fa-pencil mr-5" onClick={this.onUpdate}>Sửa</span>
                    </button>
                    &nbsp;
                    <button className="btn btn-danger">
                        <span className="fa fa-trash mr-5" onClick={this.onDelete}>Xóa</span>
                    </button>

             </td>
             </tr>
        );
    }
}
export default TaskItem;
