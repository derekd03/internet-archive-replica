import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const Create = () => {

    return (
        <div id="createhelp">
            <center>
                <h2>Upload Files</h2>
            </center>
            <p>
                Please contribute books, audio, and video files that you have the right to share.<br></br>
                The Internet Archive Replica, a non-profit library, will provide free storage and access to them.<br></br>
            </p>
            We reserve the right to remove any submitted material.
            <p>
            </p>
            <center>
                <a href="/upload" class="buttonG btn btn-success">Upload Files</a>
            </center>
        </div>
    );
};
export default Create;