import React,{useState} from 'react';
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

const NoteForm = (props) => {
  const [text, setText] = useState(props.initialText);
  const [title, setTitle] = useState("");


  const onSubmit = (event) => {
    event.preventDefault();
    if (props.submitLabel == "Update") {
      console.log("updating");
      props.handleUpdate(text);
    } else if (props.submitLabel == "Reply") {
      props.handleReply(text);
    } else {
      props.handleSubmit(text, title);
    }
    setText("");
    setTitle("");
  };
  console.log(props.initialText, "init");
  return (
    <Form onSubmit={onSubmit}>
      {props.submitLabel == "Submit" && (
        <FormGroup>
          <Label for="exampleSelect">Title</Label>
          <Input
            type="text"
            value={title}
            name="title"
            id="exampleSelect"
            onChange={(e) => setTitle(e.target.value)}
            autofocus
          ></Input>
        </FormGroup>
      )}
      <FormGroup>
        {props.submitLabel == "Submit" && (
          <Label for="description">Write Notes</Label>
        )}
        <Input
          type="textarea"
          name="text"
          id="description"
          rows={props.rows ? props.rows : "6"}
          cols={props.cols ? props.cols : ""}
          onChange={(e) => setText(e.target.value)}
          value={text}
          autofocus
        />
      </FormGroup>
      <Button className="mr-2" color="primary">
        {props.submitLabel}
      </Button>
      {props.submitLabel != "Submit" && (
        <Button
          color="danger"
          className="mr-2"
          onClick={() => props.onCancel()}
        >
          Cancel
        </Button>
      )}
    </Form>
  );
};

export default NoteForm;
