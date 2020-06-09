import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import PropTypes from "prop-types";
import { getProfileById } from "../../actions/profile";

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
          auth.user._id === profile.user._id ? (
            <Link to="/edit-profile" className="btn btn-dark">
              Edit Profile
            </Link>
          ) : (
            <div></div>
          )}
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
