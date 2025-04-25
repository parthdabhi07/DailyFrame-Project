import React from 'react'
import "./ErrorComponent.css"

export default function ErrorComponent() {
  return (
    <>
        <div className="error-component-container">
            <div className="error-content">
                <h1>404</h1>
                <h2>Page Not Found!</h2>
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
        </div>
    </>
  )
}
