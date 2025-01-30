import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from "moment";
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import pdfIcon from "../../assets/Icons/pdf.svg";
import printIcon from "../../assets/Icons/printer-xxl.svg";

import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css fil
import "../ticket/style.css";

const ProfitLossStatement = () => {
	let startdate = new Date();
	startdate.setDate(startdate.getDate() - 31);
	const [clinic, setClinic] = useState({ name: "mozart", address1: "12 mozart blv", address2: "", address3: "", zipcode: "", city: "vienna", country: "austria", phoneNo: "123456789", });
	const [income, setIncome] = useState([{ name: "income1", amount: 740, date: "8/23/2021" }, { name: "income2", amount: 1560, date: "8/25/2021" }, { name: "income3", amount: 449, date: "9/8/2021" }, { name: "income4", amount: 1274, date: "9/15/2021" }, { name: "income5", amount: 1213, date: "9/16/2021" }, { name: "income6", amount: 1285, date: "7/25/2021" }, { name: "income7", amount: 1708, date: "7/26/2021" }, { name: "income8", amount: 995, date: "8/12/2021" }, { name: "income9", amount: 1669, date: "8/15/2021" }, { name: "income10", amount: 1577, date: "8/17/2021" }]);
	const [expense, setExpense] = useState([{ name: "expense1", amount: 1823, date: "8/23/2021" }, { name: "expense2", amount: 1101, date: "8/25/2021" }, { name: "expense3", amount: 335, date: "9/8/2021" }, { name: "expense4", amount: 1042, date: "9/15/2021" }, { name: "expense5", amount: 1549, date: "9/16/2021" }, { name: "expense6", amount: 1543, date: "7/25/2021" }, { name: "expense7", amount: 1332, date: "7/26/2021" }, { name: "expense8", amount: 841, date: "8/12/2021" }, { name: "expense9", amount: 540, date: "8/15/2021" }, { name: "expense10", amount: 1185, date: "8/17/2021" }]);
	const [newincomes, setNewIncomes] = useState([]);
	const [newexpenses, setNewExpenses] = useState([]);

	const [selectionRanges, setselectionRanges] = useState({
		selection: {
			startDate: startdate,
			endDate: new Date(),
			key: "selection",
		},
	});
	const [datePickerClass, setPickerClass] = useState("d-none");

	const btnStyles = { background: "white", margin: "0rem" };

	const iconStyles = {
		width: "15px",
		height: "15px",
		marginRight: "0rem",
	};

	const sumvalues = (values) => {
		let sum = 0;
		values.map((value, index) => {
			sum += value.amount
		})
		return sum
	}

	const changeClassname = (classname) => {
		if (classname === "d-none") {
			setPickerClass("border shadow-lg");
		} else {
			setPickerClass("d-none");
		}
	}

	const calculate = (income, expense, selectionRanges) => {
		const newincome = []
		const newexpense = []
		console.log(selectionRanges.selection.startDate,selectionRanges.selection.endDate);
		const start = new Date(selectionRanges.selection.startDate)
		const end = new Date(selectionRanges.selection.endDate)
		income.map((value, index) => {
			const incomedate = new Date(value.date);
			console.log(incomedate > start && incomedate < end);
			if (incomedate > start && incomedate < end) {
				newincome.push(value);
			}
		})
		expense.map((value, index) => {
			const expensedate = new Date(value.date);
			if (expensedate > start && expensedate < end) {
				newexpense.push(value);
			}
		})
		console.log(newincome)
		console.log(newexpense)
		setNewIncomes(newincome);
		setNewExpenses(newexpense);
	}

	const calculateprofitorloss = (income, expense) => {
		const incomesum = sumvalues(income)
		const expensesum = sumvalues(expense)
		const totalamount = incomesum - expensesum
		return ({ incomesum, expensesum, totalamount });
	}

	useEffect(() => {
		calculate(income, expense, selectionRanges);
	}, [selectionRanges])

	/*useEffect(() => {
		calculate(income, expense,startDate,endDate);
	}, [endDate])*/

	const { incomesum, expensesum, totalamount } = calculateprofitorloss(newincomes, newexpenses);


	return (
		<div>
			<ol className="breadcrumb float-xl-right">
				<li className="breadcrumb-item"><Link to="/index">Home</Link></li>
				<li className="breadcrumb-item"><Link to="/accounting/invoices">Invoices</Link></li>
			</ol>
			<h1 className="page-header hidden-print">Profit Loss Statement</h1>
			<Panel>
				<PanelHeader />
				<PanelBody>
					<div className="invoice">
						<div className="invoice-content">
							<h3>Select a date range</h3>
							<div>
								<button className="btn btn-light mr-2 text-truncate" onClick={() => changeClassname(datePickerClass)}>
									<i className="fa fa-calendar fa-fw  ml-n1"></i>
									<span>{moment(selectionRanges.selection.startDate).format('LL')} - {moment(selectionRanges.selection.endDate).format('LL')} </span>
									<b className="caret"></b>
								</button>
							</div>
							<DateRangePicker
								className={`daterange position-absolute ${datePickerClass}`}
								onChange={(item) => setselectionRanges({ ...item })}
								showSelectionPreview={true}
								moveRangeOnFirstSelection={false}
								minDate={addDays(new Date(), -300)}
								maxDate={addDays(new Date(), 900)}
								months={2}
								ranges={[selectionRanges.selection]}
								direction="horizontal"
							/>
						</div>
						<div className="invoice-content">
							<span className="page-header hidden-print">Profit Loss Statement of {clinic.name}</span>
							<span style={{ float: "right" }} className="">
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="pdf"
									style={btnStyles}
								>
									{" "}
									<Link to="/accounting/profitlossstatement/">
										<img style={iconStyles} src={pdfIcon} />
									</Link>{" "}
								</button>
								<button
									className="btn btn-default active m-r-5 m-b-5"
									title="print"
									style={btnStyles}
									onClick={() => window.print()}
								>
									{" "}
									<Link to="/accounting/profitlossstatement/">
										<img style={iconStyles} src={printIcon} />
									</Link>{" "}
								</button>
							</span>
						</div>
						<div className="invoice-header">
							<div className="invoice-from">

								<address className="m-t-5 m-b-5">
									<strong className="text-inverse">{clinic.name}</strong><br />
									{clinic.address1} {clinic.address2} {clinic.address3}
									{clinic.zipcode}<br />
									{clinic.city}<br />
									{clinic.country}<br />

									<span className="m-r-8"><i className="fa fa-fw fa-lg fa-phone-volume"></i>{clinic.phoneNo}</span><br />
									<span className="m-r-10"><i className="fa fa-fw fa-lg fa-globe"></i>http: </span>
								</address>
							</div>
							<div className="invoice-date">
								<h3>Period</h3>
								<div className="date text-inverse m-t-5">{moment(selectionRanges.selection.startDate).format('LL')} to {moment(selectionRanges.selection.endDate).format('LL')}</div>
								<br />
							</div>
						</div>
						<div className="invoice-content">
							<div className="table-responsive">
								<table className="table table-invoice">
									<thead>
										<tr>
											<th><h3>Income</h3></th>
											<th className="text-right" width="20%">Amount</th>
										</tr>
									</thead>
									<tbody>
										{
											newincomes.map((value, index) => {
												return (<tr>
													<td>
														<span className="text-inverse">{value.name}</span><br />
														<small></small>
													</td>
													<td className="text-right">${value.amount}</td>
												</tr>)
											})
										}
										<tr>
											<td>
												<span className="text-inverse"><b>Total Income</b></span><br />
												<small></small>
											</td>
											<td className="text-right">${incomesum}</td>
										</tr>
									</tbody>
									<thead>
										<tr>
											<th><h3>Expenses</h3></th>
											<th className="text-right" width="20%">Amount</th>
										</tr>
									</thead>
									<tbody>
										{
											newexpenses.map((value, index) => {
												return (<tr>
													<td>
														<span className="text-inverse">{value.name}</span><br />
														<small></small>
													</td>
													<td className="text-right">${value.amount}</td>
												</tr>)
											})
										}
										<tr>
											<td>
												<span className="text-inverse"><b>Total Expense</b></span><br />
												<small></small>
											</td>
											<td className="text-right">${expensesum}</td>
										</tr>
									</tbody>

								</table>
							</div>
							<div className="invoice-price">
								{
									totalamount < 0 ? (
										<div className="invoice-price-left">
											<div className="invoice-price-row">
												<div className="sub-price">
													<span className="text-inverse">LOSS</span>
												</div>
												<div className="invoice-price-right">
													<small>TOTAL</small> <span className="f-w-600">-${Math.abs(totalamount)}.00</span>
												</div>
											</div>
										</div>

									) : (
										<div className="invoice-price-left">
											<div className="invoice-price-row">
												<div className="sub-price">
													<span className="text-inverse">PROFIT</span>
												</div>
												<div className="invoice-price-right">
													<small>TOTAL</small> <span className="f-w-600">${totalamount}.00</span>
												</div>
											</div>
										</div>
									)
								}
							</div>
							<div className="invoice-footer">
								<p className="text-center m-b-5 f-w-600">
									Powered by TCMFiles.com
								</p>
								<p className="text-center">
									<span className="m-r-10"><i className="fa fa-fw fa-lg fa-globe"></i> matiasgallipoli.com</span>
									<span className="m-r-10"><i className="fa fa-fw fa-lg fa-phone-volume"></i> T: 016-18192302</span>
									<span className="m-r-10"><i className="fa fa-fw fa-lg fa-envelope"></i> rtiemps @gmail.com</span>
									<span className="m-r-10"><i className="fa fa-fw fa-lg fa-comments"></i> making comments</span>
								</p>
							</div>
						</div>
					</div>
				</PanelBody>
			</Panel>
		</div>
	)

}

export default ProfitLossStatement;

