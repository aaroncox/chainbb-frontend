import React from 'react';

import { Label } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

export default class PostFormFieldTitle extends React.Component {
  processBody = (string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(string, "text/html").querySelector("body");
    // Remove automatically appended footer before rendering
    let elements = doc.getElementsByClassName('chainbb-footer');
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
    // Return HTML
    return doc.innerHTML
  }
  render() {
    const { disableAutoFocus, value } = this.props
    let content = false
    if(value) {
      content = this.processBody(value)
    }
    const errorLabel = <Label color="red" pointing />
    return (
      <Form.TextArea
        name="body"
        label={(<span>Post Body (Markdown Enabled - <a href='https://blog.ghost.org/markdown/' target='_blank'>Learn Markdown (?)</a>)</span>)}
        placeholder='Write your post here.'
        required
        autoFocus={!disableAutoFocus}
        rows={14}
        defaultValue={content}
        errorLabel={errorLabel}
        validationErrors={{
          isDefaultRequiredValue: 'A post body is required.',
        }}
      />
    )
  }
}
