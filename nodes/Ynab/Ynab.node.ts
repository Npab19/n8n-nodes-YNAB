import {
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class Ynab implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'YNAB',
		name: 'ynab',
		icon: 'file:ynab.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with YNAB (You Need A Budget) API',
		defaults: {
			name: 'YNAB',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'ynabApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.ynab.com/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Budget',
						value: 'budget',
					},
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Transaction',
						value: 'transaction',
					},
					{
						name: 'Category',
						value: 'category',
					},
					{
						name: 'Payee',
						value: 'payee',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'budget',
			},

			// Budget Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['budget'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all budgets',
						action: 'Get all budgets',
						routing: {
							request: {
								method: 'GET',
								url: '/budgets',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.budgets',
										},
									},
								],
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single budget',
						action: 'Get a budget',
						routing: {
							request: {
								method: 'GET',
								url: '=/budgets/{{$parameter.budgetId}}',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.budget',
										},
									},
								],
							},
						},
					},
					{
						name: 'Get Settings',
						value: 'getSettings',
						description: 'Get budget settings',
						action: 'Get budget settings',
						routing: {
							request: {
								method: 'GET',
								url: '=/budgets/{{$parameter.budgetId}}/settings',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.settings',
										},
									},
								],
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Budget ID',
				name: 'budgetId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['budget'],
						operation: ['get', 'getSettings'],
					},
				},
				default: '',
				description: 'The ID of the budget',
			},
			{
				displayName: 'Include Accounts',
				name: 'include_accounts',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['budget'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to include the list of budget accounts',
				routing: {
					request: {
						qs: {
							include_accounts: '={{$value}}',
						},
					},
				},
			},

			// Account Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all accounts for a budget',
						action: 'Get all accounts',
						routing: {
							request: {
								method: 'GET',
								url: '=/budgets/{{$parameter.budgetId}}/accounts',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.accounts',
										},
									},
								],
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single account',
						action: 'Get an account',
						routing: {
							request: {
								method: 'GET',
								url: '=/budgets/{{$parameter.budgetId}}/accounts/{{$parameter.accountId}}',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.account',
										},
									},
								],
							},
						},
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new account',
						action: 'Create an account',
						routing: {
							request: {
								method: 'POST',
								url: '=/budgets/{{$parameter.budgetId}}/accounts',
							},
							send: {
								type: 'body',
								property: 'account',
								preSend: [
									async function (
										this: IExecuteSingleFunctions,
										requestOptions: IHttpRequestOptions,
									): Promise<IHttpRequestOptions> {
										const body = {
											account: {
												name: this.getNodeParameter('accountName') as string,
												type: this.getNodeParameter('accountType') as string,
												balance: this.getNodeParameter('balance') as number,
											},
										};
										return {
											...requestOptions,
											body,
										};
									},
								],
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.account',
										},
									},
								],
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Budget ID',
				name: 'budgetId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
				default: '',
				description: 'The ID of the budget',
			},
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the account',
			},
			{
				displayName: 'Account Name',
				name: 'accountName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name of the account',
			},
			{
				displayName: 'Account Type',
				name: 'accountType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['create'],
					},
				},
				options: [
					{ name: 'Checking', value: 'checking' },
					{ name: 'Savings', value: 'savings' },
					{ name: 'Credit Card', value: 'creditCard' },
					{ name: 'Cash', value: 'cash' },
					{ name: 'Line of Credit', value: 'lineOfCredit' },
					{ name: 'Other Asset', value: 'otherAsset' },
					{ name: 'Other Liability', value: 'otherLiability' },
				],
				default: 'checking',
				description: 'The type of account',
			},
			{
				displayName: 'Balance',
				name: 'balance',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['create'],
					},
				},
				default: 0,
				description: 'The current balance of the account in milliunits format',
			},

			// Transaction Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all transactions',
						action: 'Get all transactions',
						routing: {
							request: {
								method: 'GET',
								url: '=/budgets/{{$parameter.budgetId}}/transactions',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.transactions',
										},
									},
								],
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single transaction',
						action: 'Get a transaction',
						routing: {
							request: {
								method: 'GET',
								url: '=/budgets/{{$parameter.budgetId}}/transactions/{{$parameter.transactionId}}',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.transaction',
										},
									},
								],
							},
						},
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new transaction',
						action: 'Create a transaction',
						routing: {
							request: {
								method: 'POST',
								url: '=/budgets/{{$parameter.budgetId}}/transactions',
							},
							send: {
								type: 'body',
								property: 'transaction',
								preSend: [
									async function (
										this: IExecuteSingleFunctions,
										requestOptions: IHttpRequestOptions,
									): Promise<IHttpRequestOptions> {
										const body = {
											transaction: {
												account_id: this.getNodeParameter('accountId') as string,
												date: this.getNodeParameter('date') as string,
												amount: this.getNodeParameter('amount') as number,
												payee_name: this.getNodeParameter('payeeName', '') as string,
												memo: this.getNodeParameter('memo', '') as string,
												cleared: this.getNodeParameter('cleared', 'uncleared') as string,
											},
										};
										return {
											...requestOptions,
											body,
										};
									},
								],
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.transaction',
										},
									},
								],
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a transaction',
						action: 'Update a transaction',
						routing: {
							request: {
								method: 'PUT',
								url: '=/budgets/{{$parameter.budgetId}}/transactions/{{$parameter.transactionId}}',
							},
							send: {
								type: 'body',
								property: 'transaction',
								preSend: [
									async function (
										this: IExecuteSingleFunctions,
										requestOptions: IHttpRequestOptions,
									): Promise<IHttpRequestOptions> {
										const body = {
											transaction: {
												account_id: this.getNodeParameter('accountId') as string,
												date: this.getNodeParameter('date') as string,
												amount: this.getNodeParameter('amount') as number,
												payee_name: this.getNodeParameter('payeeName', '') as string,
												memo: this.getNodeParameter('memo', '') as string,
												cleared: this.getNodeParameter('cleared', 'uncleared') as string,
											},
										};
										return {
											...requestOptions,
											body,
										};
									},
								],
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.transaction',
										},
									},
								],
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a transaction',
						action: 'Delete a transaction',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/budgets/{{$parameter.budgetId}}/transactions/{{$parameter.transactionId}}',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.transaction',
										},
									},
								],
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Budget ID',
				name: 'budgetId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
					},
				},
				default: '',
				description: 'The ID of the budget',
			},
			{
				displayName: 'Transaction ID',
				name: 'transactionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				description: 'The ID of the transaction',
			},
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'The ID of the account',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'The transaction date in ISO format (YYYY-MM-DD)',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create', 'update'],
					},
				},
				default: 0,
				description: 'The transaction amount in milliunits format',
			},
			{
				displayName: 'Payee Name',
				name: 'payeeName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'The name of the payee',
			},
			{
				displayName: 'Memo',
				name: 'memo',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Transaction memo',
			},
			{
				displayName: 'Cleared',
				name: 'cleared',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{ name: 'Cleared', value: 'cleared' },
					{ name: 'Uncleared', value: 'uncleared' },
					{ name: 'Reconciled', value: 'reconciled' },
				],
				default: 'uncleared',
				description: 'The cleared status of the transaction',
			},

			// Category Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['category'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all categories',
						action: 'Get all categories',
						routing: {
							request: {
								method: 'GET',
								url: '=/budgets/{{$parameter.budgetId}}/categories',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.category_groups',
										},
									},
								],
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single category',
						action: 'Get a category',
						routing: {
							request: {
								method: 'GET',
								url: '=/budgets/{{$parameter.budgetId}}/categories/{{$parameter.categoryId}}',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.category',
										},
									},
								],
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Budget ID',
				name: 'budgetId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['category'],
					},
				},
				default: '',
				description: 'The ID of the budget',
			},
			{
				displayName: 'Category ID',
				name: 'categoryId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['category'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the category',
			},

			// Payee Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['payee'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all payees',
						action: 'Get all payees',
						routing: {
							request: {
								method: 'GET',
								url: '=/budgets/{{$parameter.budgetId}}/payees',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.payees',
										},
									},
								],
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single payee',
						action: 'Get a payee',
						routing: {
							request: {
								method: 'GET',
								url: '=/budgets/{{$parameter.budgetId}}/payees/{{$parameter.payeeId}}',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.payee',
										},
									},
								],
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Budget ID',
				name: 'budgetId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['payee'],
					},
				},
				default: '',
				description: 'The ID of the budget',
			},
			{
				displayName: 'Payee ID',
				name: 'payeeId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['payee'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the payee',
			},

			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get authenticated user information',
						action: 'Get user info',
						routing: {
							request: {
								method: 'GET',
								url: '/user',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data.user',
										},
									},
								],
							},
						},
					},
				],
				default: 'get',
			},
		],
	};
}