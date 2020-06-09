import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../layouts/Spinner";
import PostItem from "./PostItem";
import { getPosts } from "../../actions/post";
import PostForm from "./PostForm";

const Posts = ({ getPosts, post: { posts, loading } }) => {
  // useEffect(() => getPosts(), [getPosts]);

  useEffect(() => {
    async function fetchData() {
      getPosts();
    }
    fetchData();
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fa fa-user"></i>Welcome to the Community
      </p>

      <PostForm />

      <div className="posts">
        {posts.map((each) => (
          <PostItem key={each._id} post={each}></PostItem>
        ))}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post, // combineReducers.post
});

export default connect(mapStateToProps, { getPosts })(Posts);
