# n8n-nodes-ynab

![YNAB Logo](https://cdn.prod.website-files.com/640f69143ec11b21d42015c6/6758a5396561162bbe65ae5c_524ab88af6960dd452642470297f8130_Tree%20Logo%20Blurple%20(2).svg)

Custom n8n node for YNAB (You Need A Budget) API integration. This node allows you to interact with your YNAB budgets, accounts, transactions, categories, and payees directly from n8n workflows.

## Features

### Supported Resources

- **Budgets**: Get all budgets, get single budget, get budget settings
- **Accounts**: Get all accounts, get single account, create account
- **Transactions**: Get all, get single, create, update, delete transactions
- **Categories**: Get all categories, get single category
- **Payees**: Get all payees, get single payee
- **User**: Get authenticated user information

### Authentication

Uses YNAB Personal Access Token for authentication.

## Installation

### For n8n Cloud or Self-Hosted

#### Option 1: Install via npm (Recommended)

Once published to npm, you can install this node directly in n8n:

1. Go to **Settings** > **Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-ynab`
4. Click **Install**

#### Option 2: Manual Installation

For self-hosted n8n instances:

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Clone this repository
git clone https://github.com/YOUR_USERNAME/n8n-nodes-ynab.git

# Install dependencies and build
cd n8n-nodes-ynab
npm install
npm run build

# Restart n8n
```

### For Development

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/n8n-nodes-ynab.git
   cd n8n-nodes-ynab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the node:
   ```bash
   npm run build
   ```

4. Link for local n8n development:
   ```bash
   npm link
   cd ~/.n8n/custom
   npm link n8n-nodes-ynab
   ```

5. Start your local n8n instance and test the node

## Usage

### Setting up Credentials

#### Getting Your YNAB API Token

1. Go to [YNAB Account Settings](https://app.ynab.com/settings/developer)
2. Click on **New Token**
3. Give it a name (e.g., "n8n Integration")
4. Copy the generated token (you won't be able to see it again!)

#### Configuring in n8n

1. In n8n, create new credentials of type **"YNAB API"**
2. Paste your YNAB Personal Access Token
3. Click **Test** to verify the connection
4. Click **Save**

### Example Workflow: Get All Budgets

1. Add a "Manual Trigger" node
2. Add a "YNAB" node
3. Configure the YNAB node:
   - **Resource**: Budget
   - **Operation**: Get All
   - **Include Accounts**: true (optional)
4. Connect the credentials
5. Execute the workflow

### Example Workflow: Create Transaction

1. Add a trigger node
2. Add a "YNAB" node
3. Configure the YNAB node:
   - **Resource**: Transaction
   - **Operation**: Create
   - **Budget ID**: Your budget ID
   - **Account ID**: Your account ID
   - **Date**: Transaction date (YYYY-MM-DD)
   - **Amount**: Amount in milliunits (e.g., 10000 = $10.00)
   - **Payee Name**: Payee name
   - **Memo**: Optional memo
   - **Cleared**: uncleared/cleared/reconciled

## Common Use Cases

### Budget Monitoring
- Get all budgets and their balances
- Monitor spending across categories
- Track account balances
- Generate budget reports

### Transaction Management
- Create transactions automatically from external sources
- Update transaction categories and memos
- Reconcile transactions programmatically
- Import transactions from other services

### AI-Powered Budgeting
- Use with n8n's AI Agent for intelligent budget analysis
- Get spending recommendations based on patterns
- Automate categorization with AI
- Generate natural language budget summaries

### Automation Examples
- Auto-categorize recurring transactions
- Send notifications when budgets are exceeded
- Sync transactions between multiple budgets
- Generate monthly spending reports

## API Reference

This node implements the YNAB API v1. For more information about YNAB API:
- [YNAB API Documentation](https://api.ynab.com)
- [Get Personal Access Token](https://api.ynab.com/#personal-access-tokens)

## Development

### File Structure

```
.
├── credentials/
│   └── YnabApi.credentials.ts      # YNAB API credentials definition
├── nodes/
│   └── Ynab/
│       ├── Ynab.node.ts            # Main node implementation
│       ├── Ynab.node.json          # Node codex metadata
│       └── ynab.svg                # Node icon
├── dist/                           # Compiled JavaScript (generated)
├── .development/                   # Development test files
├── package.json                    # Node package configuration
└── tsconfig.json                   # TypeScript configuration
```

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lintfix  # Auto-fix issues
```

## Compatibility

- **n8n version**: 1.110.1+
- **Node.js**: 18.17.0+
- **YNAB API**: v1

## License

MIT

## Support

For issues and questions:
- YNAB API: https://api.ynab.com
- n8n Documentation: https://docs.n8n.io

## AI Agent Compatibility

This node is designed to work seamlessly with n8n's AI Agent node. You can use this node to:
- Query budget information for AI analysis
- Create transactions based on AI decisions
- Retrieve account balances for financial planning
- Get category spending data for budget recommendations

The node uses declarative-style configuration, making it easy for AI agents to understand and utilize the available operations.