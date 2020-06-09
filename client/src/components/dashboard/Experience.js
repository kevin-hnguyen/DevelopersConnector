import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";

/**
 * The parent element is Dashboard. It will pass down experience object to this component.
 * @param {*} param0
 */
const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map((each) => (
    <tr key={each._id}>
      <td>{each.company}</td>
      <td className="hide-sm">{each.title}</td>
      <td>
        <Moment format="YYYY/MM/DD">{each.from}</Moment> -{" "}
        {each.to === null ? (
          "Now"
        ) : (
          <Moment format="YYYY/MM/DD">{each.to}</Moment>
        )}
      </td>
      <td>
        <button className="btn btn-danger" onClick={() => deleteExperience(each._id)}>
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th className="hide-sm">Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            <th className="hide-sm">Action</th>
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
