import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { deleteProduct, getProducts } from '../../services/products.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";
import sharingIcon from "../../assets/Icons/sharing.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import editIcon from "../../assets/Icons/edit.svg";
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from '../../common/pagination';
import ProductsTable from '../../components/productsTable.jsx';
import { paginate } from '../../utils/paginate';
import SearchBox from './../../common/searchBox';


class ProductTable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			products: [],
			pageSize: 10,
			currentPage: 1,
			sortColumn: { path: 'title', order: 'asc' },
			searchQuery: "",
			errors: {},
			checkedFields: []
		}

	}

	async componentDidMount() {
		//const {data:products} = await axios.get("http://localhost:4500/api/products");
		const data = await getProducts();
		console.log(data);
		this.setState({ products: data.data });
	}


	// async handleDelete(id) {
	// 	console.log(id);
	// 	// console.log(product);
	// 	const products = await this?.state?.products?.filter(el => el?._id !== id);
	// 	this && this.setState({ products: products });
	// 	await deleteProduct(id);
	// 	toast.warning("Product Deleted!")
	// };

	async handleMassDelete(data) {
		console.log(data);
		for (let i = 0; i <= data?.length; i++) {
			const products = await this?.state?.products?.filter(el => el?._id !== data[i]);
			this && this.setState({ products: products });

			await deleteProduct(data[i]);
			toast.success("Product Deleted!")

			this.setState(event => {
				const selectedPort = event.checkedFields;
				const falseIndex = selectedPort.indexOf(data[i]);
				i--;
				return selectedPort.splice(falseIndex, 1);
			})
		}
	}
		handleCheckboxChange = (e) => {
			// console.log(e?.target);
			const { value, checked } = e?.target;
			// console.log(value, checked);
			this.setState(event => {
				const selectedPort = event.checkedFields;
				if (!checked) {
					const falseIndex = selectedPort.indexOf(value);
					console.log(falseIndex);
					return selectedPort.splice(falseIndex, 1);
				}
				return selectedPort.push(value);
			})
		}

		//sorting columns
		handleSort = (sortColumn) => {
			this.setState({ sortColumn })
		};
		handlePageChange = (page) => {
			console.log(page);
			this.setState({ currentPage: page });

		};

		handleSearch = (query) => {
			console.log(query);
			this.setState({ searchQuery: query, currentPage: 1 });
		};


		getDataPgnation = () => {
			const { pageSize, currentPage, products, sortColumn, searchQuery } = this.state;
			//filter maybe next time
			let filtered = products;
			if (searchQuery) {
				console.log(searchQuery, filtered, products);
				filtered = products?.filter((el) => el?.name?.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
					el?.productType?.toLowerCase().startsWith(searchQuery.toLowerCase())
				);
			}

			//
			const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
			let nproducts = paginate(sorted, currentPage, pageSize);
			return { data: nproducts };
		}
		

		render() {

			const { length: count } = this.state.products;
			const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
			if (count === 0) return "<p>No data available</p>";

			const { data: products } = this.getDataPgnation();

			return (
				<div>
					<ToastContainer />

					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/accounting/products">Tables</Link></li>
						<li className="breadcrumb-item active">Data Tables</li>
					</ol>
					<h1 className="page-header">Products </h1>
					<Panel>
						<PanelHeader>
							Products Management
					</PanelHeader>

						<React.Fragment>
							{/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
							<div className="toolbar" style={toolbarStyles}>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="Add Product"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/products/new">
										<img style={iconStyles} src={newIcon} alt="New Icon" />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="edit product"
									style={btnStyles}
								// onClick={}
								>
									{" "}
									<Link
										to={
											this.state.checkedFields[0]
												? `/accounting/products/${this.state.checkedFields[0]}`
												: "/accounting/products/"
										}
									>
										<img style={iconStyles} src={editIcon} alt="Edit Icon" />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="delete product"
									style={btnStyles}
									onClick={() =>
										this.handleMassDelete(this.state.checkedFields)
									}
								>
									{" "}
									{/* <Link to="/accounting/products/del"> */}
									<img style={{ width: "25px", height: "25px" }} src={trashIcon} alt="Trash Icon" />
									{/* </Link>{" "} */}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="excel"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/products/">
										<img style={iconStyles} src={xlsIcon} alt="XLS Icon" />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="csv"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/products/">
										<img style={iconStyles} src={csvIcon} alt="CSV Icon" />
									</Link>{" "}
								</button>

								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="pdf"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/products/">
										<img style={iconStyles} src={pdfIcon} alt="PDF Icon" />
									</Link>{" "}
								</button>
								<button className="btn btn-default active m-r-5 m-b-5" title="Share to other" style={btnStyles}>
									{" "}
									<Link to="/accounting/products/">
										<img style={iconStyles} src={sharingIcon} alt="Sharing Icon" />
									</Link>{" "}
								</button>
							</div>
							{/* <button
							className="btn btn-default active m-r-5 m-b-5"
							title="download"
							style={
								({ marginBottom: 20 },
								{ marginLeft: 20 },
								{ marginTop: 20 })
							}
						>
							{" "}
							<Link to="/accounting/products/download">
								<i className="ion-md-download"></i>
							</Link>{" "}
						</button> */}

							<div className="table-responsive">
								<SearchBox
									value={searchQuery}
									onChange={this.handleSearch}
								/>
								<p
									className="page-header float-xl-left"
									style={
										({ marginBottom: 5 },
											{ marginLeft: 20 },
											{ marginTop: 5 })
									}
								>
									{count} entries
							</p>

								<ProductsTable
									products={products}
									onSort={this.handleSort}
									sortColumn={sortColumn}
									handleCheckboxChange={this.handleCheckboxChange}
								/>
							</div>
						</React.Fragment>

						<hr className="m-0" />
						<PanelBody>
							<div className="d-flex align-items-center justify-content-center">
								<Pagination
									itemsCount={count}
									pageSize={pageSize}
									onPageChange={this.handlePageChange}
									currentPage={currentPage}
								/>
							</div>
						</PanelBody>
					</Panel>
				</div>

			)
		}
	}
	const toolbarStyles = {
		background: "#c8e9f3",
		padding: "10px",
	};

	const btnStyles = { background: "#348fe2", margin: "0rem" };

	const iconStyles = {
		width: "25px",
		height: "25px",
		marginRight: "0rem",
	};

	export default ProductTable