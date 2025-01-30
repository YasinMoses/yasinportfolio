import React, { useEffect, useState } from "react";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import Grid from "@material-ui/core/Grid";

import { useForm } from "react-hook-form";
import { useHistory, useLocation, useParams } from "react-router";
import { Button, Label, Col, Form, FormGroup } from "reactstrap";
import { bt, nc, coavalues, subCategory } from "./coaExamples.js";
import { getCOA, saveCOA } from "../../services/coas.js";

const EditCoas = () => {
  const { pathname } = useLocation();
  const { handleSubmit, register, errors } = useForm();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(true);
  const [coa, setCoa] = useState({});
  const { coaId } = useParams();
  const fetchCoa = async () => {
    setLoading(true);
    const {data} = await getCOA(coaId);
    setCoa(data);
    // console.log(data)
    setLoading(false);
  };

  const toggleEdit = (e) => {
    e.preventDefault();
    setEdit((ed) => !ed);
  };

  useEffect(() => {
    if (pathname.includes("edit")) {
      fetchCoa();
    }
  }, []);

  const onSubmit = async (body) => {
    try {
      const {data}=await saveCOA(body)
      if(data){
        history.goBack();
      }
    } catch (error) {
      console.log(error)
    }
  };
  const history = useHistory();
  return (
    <div>
      <h1 className="page-header">COAs </h1>
      <Panel>
        <PanelHeader>Edit COA</PanelHeader>
        <PanelBody>
          {loading ? (
            <p>Loading . . . </p>
          ) : (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup row>
                <label className="col-lg-4 col-form-label" htmlFor="name">
                  Name
                </label>
                <Col>
                  <input
                    id="name"
                    type="text"
                    defaultValue={pathname.includes("edit") ? coa.name : ""}
                    disabled={!pathname.includes("new") && edit}
                    className="form-control"
                    {...register("name", { required: true })}
                  />
                </Col>
                {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
              </FormGroup>
              <FormGroup row>
                <label
                  className="col-lg-4 col-form-label"
                  htmlFor="description"
                >
                  Description
                </label>
                <Col>
                  <textarea
                    id="description"
                    type="text"
                    defaultValue={
                      pathname.includes("edit") ? coa.description : ""
                    }
                    disabled={!pathname.includes("new") && edit}
                    className="form-control"
                    {...register("category", { required: true })}
                  />
                </Col>
                {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
              </FormGroup>
              <FormGroup row>
                <label className="col-lg-4 col-form-label" htmlFor="category">
                  Category
                </label>
                <Col>
                  <select
                    id="category"
                    disabled={!pathname.includes("new") && edit}
                    className="form-control"
                    {...register("category", { required: true })}
                  >
                    {coavalues.map((cv, id) => (
                      <option
                        key={id}
                        value={cv.label}
                        selected={
                          pathname.includes("edit") &&
                          cv.label.value === coa.subCategory
                        }
                      >
                        {cv.value}
                      </option>
                    ))}
                  </select>
                </Col>
                {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
              </FormGroup>
              <FormGroup row>
                <label
                  className="col-lg-4 col-form-label"
                  htmlFor="subCategory"
                >
                  Sub-category
                </label>
                <Col>
                  <select
                    id="subCategory"
                    disabled={!pathname.includes("new") && edit}
                    className="form-control"
                    {...register("subCategory", { required: true })}
                  >
                    {subCategory.map((sbc, id) => (
                      <option
                        key={id}
                        value={sbc.value}
                        selected={
                          pathname.includes("edit") &&
                          sbc.value === coa.subCategory
                        }
                      >
                        {sbc.label}
                      </option>
                    ))}
                  </select>
                </Col>
                {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
              </FormGroup>
              <FormGroup row>
                <label
                  className="col-lg-4 col-form-label"
                  htmlFor="normalContra"
                >
                  Normal/Contra
                </label>
                <Col>
                  <select
                    id="normalContra"
                    disabled={!pathname.includes("new") && edit}
                    className="form-control"
                    {...register("normalContra", { required: true })}
                  >
                    {nc.map((n, id) => (
                      <option
                        key={id}
                        value={n.value}
                        selected={
                          pathname.includes("edit") &&
                          n.value === coa.normalContra
                        }
                      >
                        {n.label}
                      </option>
                    ))}
                  </select>
                </Col>
                {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
              </FormGroup>

              <FormGroup row>
                <label
                  className="col-lg-4 col-form-label"
                  htmlFor="balanceType"
                >
                  Balance Type
                </label>
                <Col>
                  <select
                    id="balanceType"
                    disabled={!pathname.includes("new") && edit}
                    className="form-control"
                    {...register("balanceType", { required: true })}
                  >
                    {bt.map((b, id) => (
                      <option
                        key={id}
                        value={b.value}
                        selected={
                          pathname.includes("edit") &&
                          b.value === coa.balanceType
                        }
                      >
                        {b.label}
                      </option>
                    ))}
                  </select>
                </Col>
                {/* {errors. && (
                    <div className="alert alert-danger">{errors.prefix}</div>
                  )} */}
              </FormGroup>
              <FormGroup>
                {pathname.includes("edit") ? (
                  <>
                    {edit ? (
                      <>
                        <Button
                          type="button"
                          color="danger"
                          onClick={() => history.goBack()}
                          className="m-1"
                        >
                          Go Back
                        </Button>
                        <Button
                          type="button"
                          onClick={toggleEdit}
                          className="m-1"
                        >
                          Edit
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          color="danger"
                          onClick={toggleEdit}
                          className="m-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="m-1">
                          Confirm Changes
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      color="danger"
                      onClick={() => history.goBack()}
                      className="m-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="m-1">
                      Add
                    </Button>
                  </>
                )}
              </FormGroup>
            </Form>
          )}
        </PanelBody>
      </Panel>
    </div>
  );
};

export default EditCoas;
