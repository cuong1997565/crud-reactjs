import React, { Component } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskControl from './components/TaskControl';
import _ from 'lodash';
class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tasks : [],
            isDisplayFrom : false,
            taskEditting  : null,
            filter        : {
                name   : '',
                status : -1
            },
            keyword   : '',
            sortBy    : 'name',
            sortValue :  1
        }
    }

    componentWillMount(){
        if(localStorage && localStorage.getItem('tasks')){
               var tasks = JSON.parse(localStorage.getItem('tasks'));
               this.setState({
                    tasks: tasks
               });
        }
    }

    onGenerateData = () => {
        var tasks = [
            {
                id     : this.generateID(),
                name   : 'Hoc lap trinh',
                status : true
            },
            {
                id     : this.generateID(),
                name   : 'Di boi',
                status : false
            },
            {
                id     : this.generateID(),
                name   : 'Ngu',
                status : true
            }
        ];

        localStorage.setItem('tasks', JSON.stringify(tasks));

    }

    onToggleForm = () => {
        //Thêm task
        if(this.state.isDisplayFrom && this.state.taskEditting !== null){
            this.setState({
                  isDisplayFrom : true,
                  taskEditting  : null
            });
        }
        else{
            this.setState({
              isDisplayFrom : !this.state.isDisplayFrom,
              taskEditting  : null
            })
        }
    }

    s4(){
         return Math.floor((1* Math.random() ) * 0x10000).toString(16).substring(1);
    }

    generateID(){
           return this.s4() + this.s4() + '-' + this.s4();
    }

    onCloseForm = () => {
        this.setState({
            isDisplayFrom: false,
            taskEditting     : null
        })
    }

    onShowForm = () => {
        this.setState({
            isDisplayFrom: true
        })
    }

    onSubmit = (data) => {
        var {tasks} = this.state;
        console.log("data :", data);
          //add
          if (data.id === ''){
            data.id = this.generateID();
            tasks.push(data);
          } else {
            // //edit
            var index = this.findIndex(data.id);
            tasks[index] = data;
          }
          this.setState({
              tasks            : tasks,
              taskEditting     : null
          });
          localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    //update status
    onUpdateStatus = (id) => {
        var { tasks } = this.state;
        var index = _.findIndex(tasks, (task) => {
            return task.id === id;
        });
              tasks[index].status = !tasks[index].status;
              this.setState({
                 tasks: tasks
              })
              localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    //delete
    onDelete = (id) => {
        var index = this.findIndex(id);
        var { tasks } = this.state;
        if(index !== -1){
            tasks.splice(index,1);
            this.setState({
                  tasks: tasks
            })
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        this.onCloseForm();
    }

    //update
    onUpdate = (id) => {
        var { tasks } = this.state;
        var index = this.findIndex(id);
        var taskEditting = tasks[index];
        this.setState({
             taskEditting: taskEditting
        });
        this.onShowForm();
    }
    //filter
    onFilter = (filterName , filterStatus) => {
        filterStatus = parseInt(filterStatus,10);

        this.setState({
            filter : {
                name    : filterName.toLowerCase(),
                status  : filterStatus
            }
        });
    }
    //sreach
    onSreach = (keyword) => {
        this.setState({
            keyword :keyword
        });
    }

    onSort = (sortBy, sortValue) => {
            this.setState({
               sortBy: sortBy,
               sortValue: sortValue
            });
    }

    //find id
    findIndex = (id) => {
        var {tasks} = this.state;
        var result = -1;
        tasks.forEach((task, index) => {
            if(task.id === id){
                result = index;
            }
        });
        return result;
    }

    render() {
        var {
        tasks,
        isDisplayFrom,
        taskEditting,
        filter,
        keyword,
        sortBy,
        sortValue } = this.state; //var tasks = this.state.tasks
        if(filter){
            if(filter.name){
                  tasks = tasks.filter((task) => {
                    return task.name.toLowerCase().indexOf(filter.name) !== -1;
                  });

            }
            tasks = tasks.filter((task) => {
                if(filter.status === -1){
                    return task;
                }
                else{
                     return task.status === (filter.status === 1 ? true :false)
                }
            });

        }

        if(keyword){
            // tasks = tasks.filter((task) => {
            //     return task.name.toLowerCase().indexOf(keyword) !== -1;
            // });
            tasks = _.filter(tasks, (task) => {
                return task.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
            });
        }

        if (sortBy === 'name'){
            tasks.sort((a,b) => {
                if(a.name > b.name) return sortValue;
                else if(a.name < b.name) return sortValue;
                else return 0;
            })
        } else{
            tasks.sort((a,b) => {
                if(a.status > b.status) return -sortValue;
                else if(a.status < b.status) return sortValue;
                else return 0;
            })
        }

        var elementTaskForm = isDisplayFrom ? <TaskForm
                onSubmit = { this.onSubmit }
                onCloseForm = { this.onCloseForm }
                task = { taskEditting } /> : '';
        return (
            <div className="container">
                <div className="text-center">
                    <h1>Quản Lý Công Việc</h1><hr/>
                </div>
                <div className="row">
                    <div className={ isDisplayFrom ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : '' }>
                        {elementTaskForm}
                    </div>
                    <div className= {isDisplayFrom ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12' }>
                        <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.onToggleForm} >
                            <span className="fa fa-plus mr-5"></span>
                            Thêm Công Việc
                        </button>
                        <button
                        type="button"
                        className="btn btn-danger ml-5"
                        onClick={this.onGenerateData}>
                            <span className="fa fa-plus mr-5"></span>
                            Generate Data
                        </button>

                        <TaskControl
                        onSreach   = {this.onSreach}
                        onSort     = {this.onSort}
                        sortBy     = {sortBy}
                        sortValue  = {sortValue}
                         />


                        <TaskList
                        onUpdateStatus = { this.onUpdateStatus }
                        tasks = { tasks }
                        onDelete = { this.onDelete }
                        onUpdate = { this.onUpdate }
                        onFilter = { this.onFilter } />
                    </div>
                </div>
            </div>
        );
    }
}


export default App;
