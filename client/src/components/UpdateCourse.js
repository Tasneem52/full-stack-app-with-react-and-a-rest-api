import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';
import config from '../config';

class UpdateCourse extends Component {
  _isMounted = false;

  state = {
    id: "",
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    user: {},
    isLoading: true,
    errors: [],
  };

  componentDidMount() {
    this._isMounted = true;
    axios.get(`${config.apiBaseURL}/courses/${this.props.match.params.id}`)
      .then(res => {
        const course = res.data;
        this.setState({
          id: course.id,
          title: course.title,
          description: course.description,
          estimatedTime: course.estimatedTime,
          materialsNeeded: course.materialsNeeded,
          user: course.User,
          isLoading: false
        })
      })
      .then(() => {
        if(this._isMounted) {
          if(this.state.user.id !== this.props.context.authenticatedUser.id) {
            this.props.history.push("/forbidden");
          }
        }
      })
      .catch(err => {
        if(err.status === 404) {
          this.props.history.push("/notfound");
        } else if(err.status === 500) {
          this.props.history.push("/error");
        }
      })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  returnToDetail = (e) => {
    e.preventDefault();
    this.props.history.push(`/courses/${this.props.match.params.id}`);
  }

  updateCourseTitle = (e) => {
    this.setState({ title: e.target.value });
  }

  updateCourseDescription = (e) => {
    this.setState({ description: e.target.value });
  }

  updateCourseEstimatedTime = (e) => {
    this.setState({ estimatedTime: e.target.value });
  }

  updateCourseMaterialsNeeded = (e) => {
    this.setState({ materialsNeeded: e.target.value });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const password = context.authenticatedUserPassword;
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded
    } = this.state;

    const credentials = btoa(`${authUser.emailAddress}:${password}`);
    const response = await fetch(`${config.apiBaseURL}/courses/${this.state.id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({
        title,
        description,
        estimatedTime,
        materialsNeeded
      }),
    });
    if(response.status === 204) {
      this.props.history.push("/");
    } else if(response.status === 400) {
      const data = await response.json();
      this.setState({ errors: data.message.split(",") });
    } else if(response.status === 500) {
      this.props.history.push("/error");
    }
  }

  render() {
    let id = 1;
    return (
      this.state.isLoading ? (<h2>Loading Course Information...</h2>) :
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <div>
          {
            (this.state.errors.length > 0) &&
            <div>
              <h2 className="validation--errors--label">Validation errors</h2>
              <div className="validation-errors">
                <ul>
                  {
                    (this.state.errors.map(error => {
                      return (<li key={id++}>{error}</li>);
                    }))
                  }
                </ul>
              </div>
            </div>
          }
          <form onSubmit={this.handleSubmit}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                  <input id="title"
                    name="title"
                    type="text"
                    className="input-title course--title--input"
                    placeholder="Course title..."
                    value={this.state.title}
                    onChange={this.updateCourseTitle} />
                </div>
                <p>By {this.state.user.firstName} {this.state.user.lastName}</p>
              </div>
              <div className="course--description">
                <div>
                  <textarea
                    id="description"
                    name="description"
                    className=""
                    placeholder="Course description..."
                    value={this.state.description}
                    onChange={this.updateCourseDescription}>
                  </textarea>
                </div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div>
                      <input
                        id="estimatedTime"
                        name="estimatedTime"
                        type="text"
                        className="course--time--input"
                        placeholder="Hours"
                        value={this.state.estimatedTime}
                        onChange={this.updateCourseEstimatedTime} />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea
                        id="materialsNeeded"
                        name="materialsNeeded"
                        className=""
                        placeholder="List materials..."
                        value={this.state.materialsNeeded}
                        onChange={this.updateCourseMaterialsNeeded}>
                      </textarea>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit">Update Course</button>
              <button className="button button-secondary" onClick={this.returnToDetail}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(UpdateCourse);
