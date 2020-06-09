import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import PropTypes from "prop-types";
import { getProfileById } from "../../actions/profile";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";

const Profile = ({
  match,
  auth,
  getProfileById,
  profile: { profile, loading },
}) => {
  // useEffect(() => getProfileById(match.params.id) , [getProfileById]);
  useEffect(() => {
    async function fetchData() {
      getProfileById(match.params.id);
    }
    fetchData();
  }, [getProfileById, match.params.id]);

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Go Back
          </Link>
          {auth.isAuthenticated &&
            !auth.loading &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <div className="profile-grid my-2">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((each) => (
                    <ProfileExperience
                      key={each._id}
                      experience={each}
                    ></ProfileExperience>
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credential.</h4>
              )}
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((each) => (
                    <ProfileEducation
                      key={each._id}
                      education={each}
                    ></ProfileEducation>
                  ))}
                </Fragment>
              ) : (
                <h4>No education credential.</h4>
              )}
            </div>
            {
              profile.githubusername && (
                <ProfileGithub username={profile.githubusername} />
              )
            }
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

/*
useEffect(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]);
 */

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  // if the user is the owner of the profile, renders a Edit button.
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
