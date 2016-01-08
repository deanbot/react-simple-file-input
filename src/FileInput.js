'use strict';

import React from 'react/addons';

const objectKeys = Object.keys || require('object-keys');

const STYLE = {
  FIELD: {
    visibility: 'hidden'
  }
};

const INPUT_FIELD_REF = 'inputField';

const READ_METHOD_ALIASES = {
  buffer: 'readAsArrayBuffer',
  binary: 'readAsBinaryString',
  dataUrl: 'readAsDataURL',
  text: 'readAsText'
};

const SUPPORTED_EVENTS = [
  'onLoadStart',
  'onProgress',
  'onLoadEnd',
  'onLoad',
  'onAbort',
  'onError'
];


const FileInput = React.createClass({
  propTypes: {
    readAs: React.PropTypes.oneOf(objectKeys(READ_METHOD_ALIASES)),
    onLoadStart: React.PropTypes.func,
    onLoadEnd: React.PropTypes.func,
    onLoad: React.PropTypes.func,
    onAbort: React.PropTypes.func,
    onError: React.PropTypes.func,
    onProgress: React.PropTypes.func
  },

  getDefaultProps: function () {
    return ({
      readAs: 'text'
    });
  },

  componentWillMount: function(){
    if (!window.File || !window.FileReader) {
      console.warn(
          'Browser does not appear to support API react-simple-file-input relies upon'
      );
    }
  },

  handleChange: function(event){
    const fileReader = new window.FileReader();

    const file = event.target.files[0];

    for(let i = 0; i < SUPPORTED_EVENTS.length; i++){
      const handlerName = SUPPORTED_EVENTS[i];

      if(this.props[handlerName]){
        fileReader[handlerName.toLowerCase()] = (fileReadEvent)=>{
          this.props[handlerName](fileReadEvent, file);
        };
      }
    }

    const {readAs} = this.props;

    fileReader[READ_METHOD_ALIASES[readAs]](file);
  },

  handleClick: function(){
    React.findDOMNode(this.refs[INPUT_FIELD_REF]).click();
  },

  render: function () {
    return(
        <div onClick={this.handleClick} >

    <input {...this.props}
    type='file'
    onChange={this.handleChange} ref={INPUT_FIELD_REF}
    style={STYLE.FIELD}
    />

    {this.props.children}
    </div>
    );
  }
});

export default FileInput;
