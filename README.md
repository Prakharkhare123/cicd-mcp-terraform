# 🤖 AI-Integrated CI/CD + MCP + Terraform + Kubernetes

A complete prototype demonstrating AI-integrated infrastructure management using Model Context Protocol (MCP), Terraform, and Kubernetes.

## 🏗️ Architecture

```
Developer Commit
     │
     ▼
CI/CD Pipeline (GitHub Actions)
     │
     ├── Build Docker image
     ├── Run tests  
     ├── Run Terraform plan + apply
     │
     ▼
Kubernetes Cluster (KIND/Cloud)
     │
     ▼
MCP Server ⇆ AI Assistant (Claude/ChatGPT)
   - AI can query workloads
   - AI can trigger scaling, updates, rollbacks
   - AI can analyze logs and suggest improvements
```

## 🚀 Features

### CI/CD Pipeline
- ✅ **Automated Docker builds** - Build and push to Docker Hub
- ✅ **Terraform integration** - Infrastructure as Code
- ✅ **Kubernetes deployment** - Zero-downtime rolling updates
- ✅ **Health checks** - Readiness and liveness probes
- ✅ **Verification** - Automated testing of deployed services

### AI Integration via MCP
- 🤖 **Deploy applications** - AI can trigger deployments
- 📊 **Monitor status** - Real-time cluster monitoring
- 🔄 **Scale workloads** - Dynamic scaling based on AI analysis
- 📋 **Analyze logs** - Intelligent error detection
- 🔙 **Rollback deployments** - Automated rollback capabilities
- 🚀 **Trigger CI/CD** - AI-initiated pipeline runs

## 📁 Project Structure

```
ai-cicd-mcp-k8s/
├── app/                    # Application code
│   ├── Dockerfile         # Container definition
│   └── server.js          # Node.js web server
├── terraform/             # Infrastructure as Code
│   ├── main.tf           # Kubernetes resources
│   ├── variables.tf      # Input variables
│   ├── outputs.tf        # Output values
│   └── providers.tf      # Provider configuration
├── mcp/                   # AI Integration
│   ├── server.js         # MCP server for AI tools
│   ├── package.json      # Dependencies
│   └── config.json       # MCP configuration
├── .github/workflows/     # CI/CD Pipeline
│   └── ci-cd.yaml        # GitHub Actions workflow
└── Makefile              # Development commands
```

## 🛠️ Setup Instructions

### 1. Prerequisites
```bash
# Install required tools
- Docker
- kubectl
- terraform
- node.js (for MCP server)
```

### 2. Configure Secrets
Add these secrets to your GitHub repository:
- `DOCKERHUB_USERNAME` - Your Docker Hub username
- `DOCKERHUB_TOKEN` - Your Docker Hub access token

### 3. Local Development
```bash
# Install MCP dependencies
make mcp-install

# Build and test locally
make build
make plan
make apply

# Check status
make status
make logs
```

### 4. Start MCP Server
```bash
# Start the AI integration server
make mcp-start
```

## 🤖 AI Integration Usage

Once the MCP server is running, AI assistants can:

### Deploy Applications
```
AI: "Deploy version v1.2.3 with 3 replicas"
→ MCP calls deploy_app(image_tag="v1.2.3", replicas=3)
```

### Monitor and Scale
```
AI: "What's the current status of the application?"
→ MCP calls get_app_status()

AI: "Scale to 5 replicas to handle increased traffic"
→ MCP calls scale_app(replicas=5)
```

### Analyze Issues
```
AI: "Check the logs for any errors"
→ MCP calls analyze_logs(lines=100)
→ Returns intelligent analysis of potential issues
```

### Rollback Problems
```
AI: "The new deployment has issues, rollback immediately"
→ MCP calls rollback_deployment()
```

## 🔄 CI/CD Workflow

### Automatic Triggers
1. **Push to main** → Full deployment pipeline
2. **Pull Request** → Build and test only
3. **Manual trigger** → Deploy specific versions

### Pipeline Steps
1. **Build** - Create Docker image with commit SHA tag
2. **Push** - Upload to Docker Hub registry
3. **Plan** - Generate Terraform execution plan
4. **Deploy** - Apply infrastructure changes
5. **Verify** - Test health endpoints and connectivity
6. **Analyze** - AI-powered deployment analysis

## 📊 Monitoring and Operations

### Available Commands
```bash
make help              # Show all available commands
make status            # Get deployment status
make logs              # View application logs
make scale             # Interactive scaling
make rollout           # Check rollout status
make restart           # Restart deployment
make test-health       # Test health endpoints
make full-deploy       # Complete build+push+deploy
```

### Health Monitoring
- **Readiness Probe** - `/health` endpoint (3s delay, 5s interval)
- **Liveness Probe** - `/health` endpoint (10s delay, 10s interval)
- **Resource Limits** - CPU: 500m, Memory: 256Mi
- **Resource Requests** - CPU: 100m, Memory: 128Mi

## 🌟 Key Benefits

### For Developers
- **Zero-config deployments** - Push code, get deployed app
- **AI-assisted operations** - Natural language infrastructure management
- **Comprehensive monitoring** - Real-time status and logs
- **Easy rollbacks** - One-command rollback capability

### For Operations
- **Infrastructure as Code** - All changes tracked and versioned
- **Automated scaling** - AI-driven capacity management
- **Intelligent monitoring** - AI analysis of logs and metrics
- **Consistent environments** - Same setup from dev to prod

### For AI Integration
- **Standardized interface** - MCP protocol for tool integration
- **Rich context** - Full visibility into infrastructure state
- **Action capabilities** - AI can make real infrastructure changes
- **Learning feedback** - AI learns from deployment outcomes

## 🔮 Future Enhancements

- **Multi-environment support** - Dev, staging, production
- **Advanced AI analysis** - Performance optimization suggestions
- **Cost optimization** - AI-driven resource right-sizing
- **Security scanning** - Automated vulnerability detection
- **Prometheus integration** - Advanced metrics and alerting
- **GitOps workflow** - ArgoCD integration for declarative deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `make full-deploy`
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

---

**🎯 This prototype demonstrates the future of AI-integrated DevOps - where AI assistants can understand, monitor, and manage your entire infrastructure through natural language interactions.**