import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, ControlLabel, Checkbox, FormGroup, FormControl, Button, Glyphicon } from 'react-bootstrap';
import fetchJobs from '../helper_functions/fetchJobs';
import PlacesAutocomplete from 'react-places-autocomplete'
import PopulateJobList from './PopulateJobList';
import GoogleMapsModal from './GoogleMapsModal';
import ReactTooltip from 'react-tooltip'
import infoSpace from '../helper_functions/infoSpace';

/*
TO:DO:
select all jobs
paginate onclick update url
 */
//===============================================================================================//
const queryArr = [];

class JobResults extends Component {
    constructor() {
        super();
        this.state = {
            location: '',
            maxDistance: '',
            queryBuilder: queryArr,
            jobType: ''
        };
        this.onUpdateLocation = this.onUpdateLocation.bind(this);
        this.onUpdateMaxDistance = this.onUpdateMaxDistance.bind(this);
        this.onFilterJobRoles = this.onFilterJobRoles.bind(this);
        this.onFilterJobType = this.onFilterJobType.bind(this);
    }


    componentWillMount() {
        // user did not arrive at this page from landing. Populate national job results.
        if (!this.props.jobList.length) {
            fetchJobs(null, null, this.props)
                .then((res) => {
                    if (res === 'error') {
                        return alert('Something went wrong :( We were unable to retrieve job results. Please try again later or let us know if this issue persists.');
                    }
                })
        }
        if (this.props.locationParam) {
            this.setState({ location: this.props.locationParam})
        }
        if (this.props.maxDistance) {
            this.setState({ maxDistance: this.props.maxDistance})
        }
    }

    onUpdateLocation(location) {
        let query = (this.state.queryBuilder.length ? this.state.queryBuilder: 'solar');
        this.setState({ location: location });
        fetchJobs(this.state.location, this.state.maxDistance, this.props, query, this.state.jobType)
    }

    onUpdateMaxDistance(event) {
        let query = (this.state.queryBuilder.length ? this.state.queryBuilder: 'solar');
        this.setState({ maxDistance: event.target.value });
        fetchJobs(this.state.location, this.state.maxDistance, this.props, query, this.state.jobType)
    }

    onFilterJobRoles(event) {
        if (event.target.checked) {
            queryArr.push(event.target.value);
        } else {
            const index = queryArr.indexOf(event.target.value);
            if (index > -1) {
                queryArr.splice(index, 1);
            }
        }
        fetchJobs(this.state.location, this.state.maxDistance, this.props, queryArr, this.state.jobType)
    }

    onFilterJobType(event) {
        let query = (this.state.queryBuilder.length ? this.state.queryBuilder: 'solar');
        this.setState({ jobType: event.target.value });
        fetchJobs(this.state.location, this.state.maxDistance, this.props, query, this.state.jobType)
    }


    render() {
        // console.log(this.state);

        return (
            <section className="jobResults">

                <div className="modifyGeoSearch">
                    <span id="grayBG"/>

                    <Form>
                        <div className="geoUpdateContainer">
                            <div id="updateLocation">
                                <Glyphicon glyph="search" bsStyle='large' id="searchIcon"/>

                                <FormGroup id="updateLocation">
                                    <PlacesAutocomplete
                                        inputProps={{
                                            value: this.state.location,
                                            onChange: this.onUpdateLocation,
                                            placeholder: 'Enter city or leave blank to see all results'
                                        }}
                                        styles= {{
                                            root: { width: '90%', marginLeft: '2.5em', display: 'inline-block', marginRight: '0'}
                                        }}
                                        options={{types: ['(cities)']}}/>
                                </FormGroup>
                            </div>
                            <div id="updateMaxDistance">
                                <Glyphicon glyph="map-marker" bsStyle='large' id="radiusIcon"/>

                                <FormGroup>
                                    <FormControl
                                        id="distanceDropDownMenu"
                                        componentClass="select"
                                        name="maxDistance"
                                        onChange={this.onUpdateMaxDistance}
                                        value={this.state.maxDistance}
                                    >
                                        <option value="3000">-</option>
                                        <option value="25">25 miles</option>
                                        <option value="50">50 miles</option>
                                        <option value="75">75 miles</option>
                                        <option value="100">100 miles</option>
                                        <option value="500">500 miles</option>
                                        <option value="1000">1000 miles</option>
                                    </FormControl>
                                </FormGroup>
                            </div>
                        </div>

                        <br />

                        <FormGroup id="modifyJobRole">
                            <ControlLabel id="label">Filter job roles:</ControlLabel>
                            <FormGroup>
                                <Checkbox inline name="" value="sales" onClick={this.onFilterJobRoles}>
                                    <a data-tip="tbd tbd tbd">Field/Sales</a>
                                    <ReactTooltip place="top" type="dark" effect="float"/>
                                </Checkbox>
                                <Checkbox inline name="" value="engineer" onClick={this.onFilterJobRoles}>
                                    <a data-tip="an engineer does this">Design/Engineer</a>
                                    <ReactTooltip place="top" type="dark" effect="float"/>
                                </Checkbox>
                                <Checkbox inline name="" value="installer" onClick={this.onFilterJobRoles}>
                                    <a data-tip="installer, roofer, etc">Installer/Technician</a>
                                    <ReactTooltip place="top" type="dark" effect="float"/>
                                </Checkbox>
                                <Checkbox inline name="" value="pm" onClick={this.onFilterJobRoles}>
                                    <a data-tip="project manager, analsyst">Project Management/Analyst</a>
                                    <ReactTooltip place="top" type="dark" effect="float"/>
                                </Checkbox>
                                <Checkbox inline name="" value="csr" onClick={this.onFilterJobRoles}>
                                    <a data-tip="customer service, talk on phone">Customer Service</a>
                                    <ReactTooltip place="top" type="dark" effect="float"/>
                                </Checkbox>
                            </FormGroup>
                        </FormGroup>
                    </Form>

                    <div className='modifyJobType'>
                        <Button value='""' onClick={this.onFilterJobType}>All job types</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button value='fulltime' onClick={this.onFilterJobType}>Full-Time</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button value='parttime' onClick={this.onFilterJobType}>Part-Time</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button value='contract' onClick={this.onFilterJobType}>Contract</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button value='internship' onClick={this.onFilterJobType}>Internship</Button>
                    </div>
                </div>


                {/* Import iFrame class component */}
                <GoogleMapsModal />


                {/* Import class to populate table body with job results*/}
                <PopulateJobList/>

                <br />

                {/* Import placeholder for ads*/}
                {infoSpace}

            </section>
        )
    }
}


export default connect(mapStateToProps)(JobResults);

function mapStateToProps(state) {
    return {
        jobList: state.jobList.jobsList,
        locationParam: state.jobList.locationParam,
        maxDistance: state.jobList.maxDistance,
        urlOpenList: state.jobList.urlOpenList,
        locationToLaunch: state.jobList.locationToLaunch,
        currentPage: state.jobList.currentPage
    };
}