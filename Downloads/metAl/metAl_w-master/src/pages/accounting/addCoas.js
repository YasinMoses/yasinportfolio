import React from "react";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "./../../components/panel/panel.jsx";
import Grid from "@material-ui/core/Grid";

import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Button, Form, Label, Col } from "reactstrap";
import { FormGroup } from "@material-ui/core";

const AddCoas = () => {
  const { handleSubmit, register, errors } = useForm();
  const onSubmit = (body) => {
    console.log(body);
    history.goBack();
  };
  const history = useHistory();
  return (
    <div>
      <h1 className="page-header">COAs </h1>
      <Panel>
        <PanelHeader>Add new COA</PanelHeader>
        <PanelBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <label className="col-lg-4 col-form-label" htmlFor="prefix">
                Name
              </label>
              <Col>
                <input
                  type="text"
                  className="form-control"
                  {...register("name", { required: true })}
                />
              </Col>
              {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
            </FormGroup>

            <FormGroup>
              <label className="col-lg-4 col-form-label" htmlFor="prefix">
                Description
              </label>
              <Col>
                <textarea
                  className="form-control"
                  {...register("description", { required: true })}
                />
              </Col>
              {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
            </FormGroup>

            <FormGroup>
              <label className="col-lg-4 col-form-label" htmlFor="prefix">
                Category
              </label>
              <Col>
                <select
                  className="form-control"
                  {...register("category", { required: true })}
                >
                  <option value="01">Assets</option>
                  <option value="02">Liability</option>
                  <option value="03">Equity</option>
                </select>
              </Col>
              {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
            </FormGroup>

            <FormGroup>
              <label className="col-lg-4 col-form-label" htmlFor="prefix">
                Sub-category
              </label>
              <Col>
                <select
                  className="form-control"
                  {...register("subCategory", { required: true })}
                >
                  <option value="01">Current</option>
                  <option value="02">Inventory</option>
                  <option value="03">Tangible</option>
                </select>
              </Col>
              {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
            </FormGroup>

            <FormGroup>
              <label className="col-lg-4 col-form-label" htmlFor="prefix">
                Normal/Contra
              </label>
              <Col>
                <select
                  className="form-control"
                  {...register("normalContra", { required: true })}
                >
                  <option value="normal">Normal</option>
                  <option value="contra">Contra</option>
                </select>
              </Col>
              {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
            </FormGroup>

            <FormGroup>
              <label className="col-lg-4 col-form-label" htmlFor="prefix">
                Balance Type
              </label>
              <Col>
                <select
                  className="form-control"
                  {...register("balanceType", { required: true })}
                >
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
              </Col>
              {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
            </FormGroup>
            <FormGroup>
              <Button type="submit" color="primary" className="m-1">
                Add
              </Button>
              <Button
                type="button"
                color="danger"
                onClick={() => history.goBack()}
                className="m-1"
              >
                Cancel
              </Button>
            </FormGroup>
          </Form>
        </PanelBody>
      </Panel>
    </div>
  );
};

export default AddCoas;
