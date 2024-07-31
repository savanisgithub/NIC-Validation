import React from 'react'
import {Link} from 'react-router-dom'


function Navigation() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark" >
            <div className="p-4">
                <a className="navbar-brand" href="#"> 
                    ID-Validator
                </a>
            </div>
            <div className="flex-grow">
                <ul className="navbar-nav flex justify-end space-x-4 pe-3">
                    <li className="nav-item">
                        <Link className="nav-link" to="/fileupload">File-Upload</Link>
                    </li>
                    <li className="nav-item ">
                        <Link className="nav-link "  to="/dashboard">Dashboard </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/summary">Summary</Link>
                    </li>
                    <li className="nav-item">
                        <button className="btn btn-danger btn-sm">
                            <Link className="nav-link text-white" to="/">Logout</Link>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;