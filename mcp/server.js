#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

class AIInfrastructureMCP {
  constructor() {
    this.server = new Server(
      {
        name: 'ai-infrastructure-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'deploy_app',
          description: 'Deploy application to Kubernetes using Terraform',
          inputSchema: {
            type: 'object',
            properties: {
              image_tag: { type: 'string', description: 'Docker image tag to deploy' },
              replicas: { type: 'number', description: 'Number of replicas', default: 2 },
              service_type: { type: 'string', description: 'Service type (ClusterIP, NodePort, LoadBalancer)', default: 'NodePort' }
            },
            required: ['image_tag']
          }
        },
        {
          name: 'scale_app',
          description: 'Scale application replicas',
          inputSchema: {
            type: 'object',
            properties: {
              replicas: { type: 'number', description: 'Number of replicas to scale to' }
            },
            required: ['replicas']
          }
        },
        {
          name: 'get_app_status',
          description: 'Get current application deployment status',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'rollback_deployment',
          description: 'Rollback to previous deployment',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'analyze_logs',
          description: 'Analyze application logs for issues',
          inputSchema: {
            type: 'object',
            properties: {
              lines: { type: 'number', description: 'Number of log lines to analyze', default: 50 }
            }
          }
        },
        {
          name: 'trigger_cicd',
          description: 'Trigger CI/CD pipeline via GitHub Actions',
          inputSchema: {
            type: 'object',
            properties: {
              branch: { type: 'string', description: 'Branch to deploy', default: 'main' }
            }
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'deploy_app':
            return await this.deployApp(args);
          case 'scale_app':
            return await this.scaleApp(args);
          case 'get_app_status':
            return await this.getAppStatus();
          case 'rollback_deployment':
            return await this.rollbackDeployment();
          case 'analyze_logs':
            return await this.analyzeLogs(args);
          case 'trigger_cicd':
            return await this.triggerCICD(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ]
        };
      }
    });
  }

  async deployApp(args) {
    const { image_tag, replicas = 2, service_type = 'NodePort' } = args;
    
    // Generate Terraform variables
    const tfvars = `
image = "pk233/ai-cicd-app:${image_tag}"
app_name = "ai-cicd-app"
namespace = "default"
replicas = ${replicas}
service_type = "${service_type}"
`;

    await fs.writeFile(path.join(__dirname, '../terraform/auto.tfvars'), tfvars);

    // Run Terraform
    const { stdout, stderr } = await execAsync('cd ../terraform && terraform init -upgrade && terraform apply -auto-approve -var-file=auto.tfvars');

    return {
      content: [
        {
          type: 'text',
          text: `✅ Deployment successful!\n\nImage: pk233/ai-cicd-app:${image_tag}\nReplicas: ${replicas}\nService Type: ${service_type}\n\nTerraform Output:\n${stdout}`
        }
      ]
    };
  }

  async scaleApp(args) {
    const { replicas } = args;
    
    const { stdout } = await execAsync(`kubectl scale deployment ai-cicd-app --replicas=${replicas}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `✅ Scaled application to ${replicas} replicas\n\n${stdout}`
        }
      ]
    };
  }

  async getAppStatus() {
    const commands = [
      'kubectl get deployments ai-cicd-app -o wide',
      'kubectl get pods -l app=ai-cicd-app',
      'kubectl get svc ai-cicd-app-svc',
      'kubectl top pods -l app=ai-cicd-app || echo "Metrics not available"'
    ];

    let output = '📊 Application Status:\n\n';
    
    for (const cmd of commands) {
      try {
        const { stdout } = await execAsync(cmd);
        output += `${cmd}:\n${stdout}\n\n`;
      } catch (error) {
        output += `${cmd}: Error - ${error.message}\n\n`;
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: output
        }
      ]
    };
  }

  async rollbackDeployment() {
    const { stdout } = await execAsync('kubectl rollout undo deployment/ai-cicd-app');
    
    return {
      content: [
        {
          type: 'text',
          text: `🔄 Rollback initiated\n\n${stdout}`
        }
      ]
    };
  }

  async analyzeLogs(args) {
    const { lines = 50 } = args;
    
    const { stdout } = await execAsync(`kubectl logs -l app=ai-cicd-app --tail=${lines}`);
    
    // Simple log analysis
    const errors = stdout.split('\n').filter(line => 
      line.toLowerCase().includes('error') || 
      line.toLowerCase().includes('exception') ||
      line.toLowerCase().includes('failed')
    );

    let analysis = `📋 Log Analysis (last ${lines} lines):\n\n`;
    
    if (errors.length > 0) {
      analysis += `⚠️ Found ${errors.length} potential issues:\n`;
      errors.forEach((error, i) => {
        analysis += `${i + 1}. ${error}\n`;
      });
    } else {
      analysis += '✅ No obvious errors found in recent logs\n';
    }
    
    analysis += `\n📝 Full logs:\n${stdout}`;

    return {
      content: [
        {
          type: 'text',
          text: analysis
        }
      ]
    };
  }

  async triggerCICD(args) {
    const { branch = 'main' } = args;
    
    // This would typically trigger via GitHub API
    // For now, we'll show how to monitor the pipeline
    
    return {
      content: [
        {
          type: 'text',
          text: `🚀 CI/CD Pipeline Trigger\n\nTo trigger the pipeline:\n1. Push to ${branch} branch\n2. Or manually trigger via GitHub Actions\n3. Monitor at: https://github.com/Prakharkhare123/cicd-mcp-terraform/actions\n\nPipeline will:\n✅ Build Docker image\n✅ Run tests\n✅ Deploy to Kubernetes\n✅ Verify deployment`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('AI Infrastructure MCP Server running on stdio');
  }
}

// Start the server
if (require.main === module) {
  const server = new AIInfrastructureMCP();
  server.run().catch(console.error);
}

module.exports = AIInfrastructureMCP;