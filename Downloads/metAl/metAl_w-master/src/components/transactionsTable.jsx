import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class TransactionsTable extends Component {
	columns = [
		{
			key: "checkbox",
			label: <input type="check" style={checkboxStyles} />,
			content: (transaction) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={checkboxStyles}
						onChange={this.props.handleCheckboxChange}
						value={transaction._id}
					/>
				</span>
			),
		},
		{ label: "TransactionNo", path: "transactionNo" },
		{ label: "COA", path: "COA" },		
		{ label: "Title", path: "title" },
		{ label: "Category", path: "category" },
		{ label: "Sub-category", path: "subCategory" },
		{ label: "Amount", path: "amount" },
		{ label: "Currency", path: "currency" },
		{ label: "Payer", path: "payer" },
		{ label: "Payee", path: "payee" },
		{ label: "Paid-Method", path: "paidMethod" },
		{ label: "Narration", path: "narration" },
		{ label: "Nature/contra", path: "natureContra" },
		{ label: "BalanceType", path: "balanceType" },
		{ label: "PaymentType", path: "paymentType" },
		{ label: "Reference", path: "reference" },
		{ label: "Sharinglink", path: "sharingLink" },
		{ label: "SharedTo", path: "sharedTo" },
		{ label: "Paid-date", path: "paidDate" },		
		{ label: "Note", path: "note" },
		{ label: "Status", path: "status" },			
	];

	render() {
		//console.log(this.columns) ;
		const { transactions, onSort, sortColumn } = this.props;
		return <Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={transactions} />;
	}
}

const checkboxStyles = {
	width: "15px",
	height: "15px",
	marginTop: "0.4rem",
	borderRadius: 0,
};

export default TransactionsTable;
