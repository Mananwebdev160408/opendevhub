"use client"

import * as React from "react"
import { Copy, Download, Plus, Trash2, Layers } from "lucide-react"

interface CustomRow {
  id: string
  key: string
  value: string
  type: "string" | "number" | "boolean" | "array"
}

type TemplateType =
  | "docker-compose"
  | "docker-compose-stack"
  | "github-actions"
  | "gitlab-ci"
  | "k8s-pod"
  | "k8s-deployment"
  | "k8s-service"
  | "k8s-ingress"
  | "k8s-configmap"
  | "helm-values"
  | "serverless"
  | "ansible-playbook"
  | "openapi-spec"
  | "flutter-pubspec"
  | "prometheus-rules"
  | "pm2-ecosystem"
  | "app-config"

export function YamlGenerator() {
  const [generatorMode, setGeneratorMode] = React.useState<"templates" | "custom">("templates")
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateType>("docker-compose")

  // --- TEMPLATE INPUT STATES ---

  // 1. Docker Compose Service
  const [dockerService, setDockerService] = React.useState("web-app")
  const [dockerImage, setDockerImage] = React.useState("node:20-alpine")
  const [dockerHostPort, setDockerHostPort] = React.useState("3000")
  const [dockerContainerPort, setDockerContainerPort] = React.useState("3000")
  const [dockerRestart, setDockerRestart] = React.useState("always")
  const [dockerEnvKey1, setDockerEnvKey1] = React.useState("NODE_ENV")
  const [dockerEnvVal1, setDockerEnvVal1] = React.useState("production")
  const [dockerEnvKey2, setDockerEnvKey2] = React.useState("PORT")
  const [dockerEnvVal2, setDockerEnvVal2] = React.useState("3000")

  // 2. Docker Compose Stack
  const [stackSvcName, setStackSvcName] = React.useState("api-server")
  const [stackSvcImage, setStackSvcImage] = React.useState("node:20-alpine")
  const [stackDbName, setStackDbName] = React.useState("postgres-db")
  const [stackDbPort, setStackDbPort] = React.useState("5432")
  const [stackCacheName, setStackCacheName] = React.useState("redis-cache")
  const [stackCachePort, setStackCachePort] = React.useState("6379")

  // 3. GitHub Actions CI
  const [ghWorkflowName, setGhWorkflowName] = React.useState("Node.js CI")
  const [ghBranch, setGhBranch] = React.useState("main")
  const [ghNodeVersion, setGhNodeVersion] = React.useState("20.x")
  const [ghBuildCmd, setGhBuildCmd] = React.useState("npm run build")
  const [ghTestCmd, setGhTestCmd] = React.useState("npm test")

  // 4. GitLab CI Pipeline
  const [glStages, setGlStages] = React.useState("build, test, deploy")
  const [glImage, setGlImage] = React.useState("node:20-alpine")
  const [glBuildCmd, setGlBuildCmd] = React.useState("npm run build")
  const [glTestCmd, setGlTestCmd] = React.useState("npm test")
  const [glDeployEnv, setGlDeployEnv] = React.useState("production")

  // 5. Kubernetes Pod
  const [k8sPodName, setK8sPodName] = React.useState("app-pod")
  const [k8sContainerName, setK8sContainerName] = React.useState("web-container")
  const [k8sContainerImage, setK8sContainerImage] = React.useState("nginx:alpine")
  const [k8sPodPort, setK8sPodPort] = React.useState("80")
  const [k8sCpuLimit, setK8sCpuLimit] = React.useState("500m")
  const [k8sMemLimit, setK8sMemLimit] = React.useState("512Mi")

  // 6. Kubernetes Deployment
  const [k8sDepName, setK8sDepName] = React.useState("web-deployment")
  const [k8sDepReplicas, setK8sDepReplicas] = React.useState("3")
  const [k8sDepImage, setK8sDepImage] = React.useState("node:20-alpine")
  const [k8sDepPort, setK8sDepPort] = React.useState("3000")

  // 7. Kubernetes Service
  const [k8sSvcName, setK8sSvcName] = React.useState("app-service")
  const [k8sSvcSelectorKey, setK8sSvcSelectorKey] = React.useState("app")
  const [k8sSvcSelectorVal, setK8sSvcSelectorVal] = React.useState("web")
  const [k8sSvcPort, setK8sSvcPort] = React.useState("80")
  const [k8sSvcTargetPort, setK8sSvcTargetPort] = React.useState("8080")
  const [k8sSvcType, setK8sSvcType] = React.useState("ClusterIP")

  // 8. Kubernetes Ingress
  const [k8sIngName, setK8sIngName] = React.useState("app-ingress")
  const [k8sIngHost, setK8sIngHost] = React.useState("app.example.com")
  const [k8sIngSvcName, setK8sIngSvcName] = React.useState("app-service")
  const [k8sIngSvcPort, setK8sIngSvcPort] = React.useState("80")

  // 9. Kubernetes ConfigMap
  const [k8sCmName, setK8sCmName] = React.useState("app-config")
  const [k8sCmKey, setK8sCmKey] = React.useState("API_TIMEOUT")
  const [k8sCmVal, setK8sCmVal] = React.useState("5000")

  // 10. Helm Values
  const [helmReplicas, setHelmReplicas] = React.useState("2")
  const [helmRepo, setHelmRepo] = React.useState("my-app")
  const [helmTag, setHelmTag] = React.useState("latest")
  const [helmPort, setHelmPort] = React.useState("80")

  // 11. Serverless Framework
  const [slsName, setSlsName] = React.useState("user-service")
  const [slsRuntime, setSlsRuntime] = React.useState("nodejs20.x")
  const [slsRegion, setSlsRegion] = React.useState("us-east-1")
  const [slsHttpPath, setSlsHttpPath] = React.useState("/users")

  // 12. Ansible Playbook
  const [ansibleHosts, setAnsibleHosts] = React.useState("webservers")
  const [ansibleTaskName, setAnsibleTaskName] = React.useState("Install Nginx")
  const [ansiblePkg, setAnsiblePkg] = React.useState("nginx")

  // 13. OpenAPI 3.0
  const [apiTitle, setApiTitle] = React.useState("User API")
  const [apiVersion, setApiVersion] = React.useState("1.0.0")
  const [apiPath, setApiPath] = React.useState("/users")
  const [apiMethod, setApiMethod] = React.useState("get")

  // 14. Flutter Pubspec
  const [flutterName, setFlutterName] = React.useState("flutter_app")
  const [flutterDesc, setFlutterDesc] = React.useState("A new Flutter application.")
  const [flutterSdk, setFlutterSdk] = React.useState(">=3.0.0 <4.0.0")

  // 15. Prometheus Alerts
  const [promAlertGroup, setPromAlertGroup] = React.useState("host-alerts")
  const [promAlertName, setPromAlertName] = React.useState("HighCpuUsage")
  const [promExpr, setPromExpr] = React.useState("cpu_usage > 90")

  // 16. PM2 Ecosystem
  const [pm2AppName, setPm2AppName] = React.useState("api-server")
  const [pm2Script, setPm2Script] = React.useState("./dist/main.js")
  const [pm2Instances, setPm2Instances] = React.useState("max")

  // 17. App Config
  const [cfgAppName, setCfgAppName] = React.useState("my-service")
  const [cfgVersion, setCfgVersion] = React.useState("1.0.0")
  const [cfgEnv, setCfgEnv] = React.useState("production")
  const [cfgDbEnabled, setCfgDbEnabled] = React.useState(true)
  const [cfgFeatures, setCfgFeatures] = React.useState("auth, users, billing")

  // Custom key-values inputs
  const [customRows, setCustomRows] = React.useState<CustomRow[]>([
    { id: "1", key: "name", value: "My Service", type: "string" },
    { id: "2", key: "port", value: "8080", type: "number" },
    { id: "3", key: "debug", value: "true", type: "boolean" },
    { id: "4", key: "tags", value: "api, auth, live", type: "array" }
  ])

  // Generator actions
  const [copiedGenerator, setCopiedGenerator] = React.useState(false)

  // YAML Generation Logic
  const generatedYaml = React.useMemo(() => {
    if (generatorMode === "templates") {
      switch (selectedTemplate) {
        case "docker-compose":
          return `version: "3.8"

services:
  ${dockerService || "web-app"}:
    image: ${dockerImage || "node:20-alpine"}
    restart: ${dockerRestart || "always"}
    ports:
      - "${dockerHostPort || "3000"}:${dockerContainerPort || "3000"}"
    environment:
      - ${dockerEnvKey1 || "NODE_ENV"}=${dockerEnvVal1 || "production"}
      - ${dockerEnvKey2 || "PORT"}=${dockerEnvVal2 || "3000"}`

        case "docker-compose-stack":
          return `version: "3.8"

services:
  ${stackSvcName || "api-server"}:
    image: ${stackSvcImage || "node:20-alpine"}
    ports:
      - "3000:3000"
    depends_on:
      - db
      - cache
    environment:
      - DATABASE_URL=postgres://postgres:secret@db:${stackDbPort || "5432"}/app
      - REDIS_URL=redis://cache:${stackCachePort || "6379"}

  db:
    image: postgres:15-alpine
    container_name: ${stackDbName || "postgres-db"}
    ports:
      - "${stackDbPort || "5432"}:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=app
    volumes:
      - pgdata:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine
    container_name: ${stackCacheName || "redis-cache"}
    ports:
      - "${stackCachePort || "6379"}:6379"

volumes:
  pgdata:`

        case "github-actions":
          return `name: ${ghWorkflowName || "Node.js CI"}

on:
  push:
    branches:
      - ${ghBranch || "main"}

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "${ghNodeVersion || "20.x"}"
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Build Project
        run: ${ghBuildCmd || "npm run build"}

      - name: Run Tests
        run: ${ghTestCmd || "npm test"}`

        case "gitlab-ci":
          const glStagesList = (glStages || "build, test, deploy")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
          
          let glStagesYaml = ""
          glStagesList.forEach(stg => {
            glStagesYaml += `\n  - ${stg}`
          })

          return `image: ${glImage || "node:20-alpine"}

stages:${glStagesYaml || "\n  - build\n  - test\n  - deploy"}

cache:
  paths:
    - node_modules/

build-job:
  stage: build
  script:
    - npm install
    - ${glBuildCmd || "npm run build"}
  artifacts:
    paths:
      - dist/

test-job:
  stage: test
  script:
    - ${glTestCmd || "npm test"}

deploy-job:
  stage: deploy
  script:
    - echo "Deploying to ${glDeployEnv || "production"} server..."
  environment:
    name: ${glDeployEnv || "production"}`

        case "k8s-pod":
          return `apiVersion: v1
kind: Pod
metadata:
  name: ${k8sPodName || "app-pod"}
  labels:
    app: ${k8sPodName || "app-pod"}
spec:
  containers:
    - name: ${k8sContainerName || "web-container"}
      image: ${k8sContainerImage || "nginx:alpine"}
      ports:
        - containerPort: ${k8sPodPort || 80}
      resources:
        limits:
          cpu: "${k8sCpuLimit || "500m"}"
          memory: "${k8sMemLimit || "512Mi"}"
        requests:
          cpu: "100m"
          memory: "128Mi"`

        case "k8s-deployment":
          return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${k8sDepName || "web-deployment"}
  labels:
    app: ${k8sDepName || "web-deployment"}
spec:
  replicas: ${k8sDepReplicas || 3}
  selector:
    matchLabels:
      app: ${k8sDepName || "web-deployment"}
  template:
    metadata:
      labels:
        app: ${k8sDepName || "web-deployment"}
    spec:
      containers:
        - name: app-container
          image: ${k8sDepImage || "node:20-alpine"}
          ports:
            - containerPort: ${k8sDepPort || 3000}
          resources:
            limits:
              cpu: "1"
              memory: "1Gi"
            requests:
              cpu: "250m"
              memory: "256Mi"`

        case "k8s-service":
          return `apiVersion: v1
kind: Service
metadata:
  name: ${k8sSvcName || "app-service"}
spec:
  type: ${k8sSvcType || "ClusterIP"}
  selector:
    ${k8sSvcSelectorKey || "app"}: ${k8sSvcSelectorVal || "web"}
  ports:
    - protocol: TCP
      port: ${k8sSvcPort || 80}
      targetPort: ${k8sSvcTargetPort || 8080}`

        case "k8s-ingress":
          return `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${k8sIngName || "app-ingress"}
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: ${k8sIngHost || "app.example.com"}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ${k8sIngSvcName || "app-service"}
                port:
                  number: ${k8sIngSvcPort || 80}`

        case "k8s-configmap":
          return `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${k8sCmName || "app-config"}
data:
  ${k8sCmKey || "API_TIMEOUT"}: "${k8sCmVal || "5000"}"
  DB_HOST: "postgres-service"
  LOG_LEVEL: "info"`

        case "helm-values":
          return `# Default Helm Chart values for your application
replicaCount: ${helmReplicas || 2}

image:
  repository: ${helmRepo || "my-app"}
  pullPolicy: IfNotPresent
  tag: "${helmTag || "latest"}"

service:
  type: ClusterIP
  port: ${helmPort || 80}

resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi`

        case "serverless":
          return `service: ${slsName || "user-service"}

frameworkVersion: '3'

provider:
  name: aws
  runtime: ${slsRuntime || "nodejs20.x"}
  stage: ${slsRegion || "dev"}
  region: ${slsRegion || "us-east-1"}
  environment:
    SERVICE_NAME: ${slsName || "user-service"}

functions:
  api:
    handler: handler.handler
    events:
      - http:
          path: ${slsHttpPath || "/users"}
          method: any`

        case "ansible-playbook":
          return `---
- name: Configure server packages
  hosts: ${ansibleHosts || "webservers"}
  become: true
  tasks:
    - name: ${ansibleTaskName || "Install Nginx"}
      apt:
        name: ${ansiblePkg || "nginx"}
        state: present
        update_cache: true

    - name: Ensure service is running
      service:
        name: ${ansiblePkg || "nginx"}
        state: started
        enabled: true`

        case "openapi-spec":
          return `openapi: 3.0.3
info:
  title: ${apiTitle || "User API"}
  version: ${apiVersion || "1.0.0"}
  description: Auto-generated OpenAPI 3.0 specification file.

paths:
  ${apiPath || "/users"}:
    ${apiMethod || "get"}:
      summary: Retrieve standard payload
      responses:
        '200':
          description: A successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: ok`

        case "flutter-pubspec":
          return `name: ${flutterName || "flutter_app"}
description: ${flutterDesc || "A new Flutter application."}
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '${flutterSdk || ">=3.0.0 <4.0.0"}'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.5
  http: ^1.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`

        case "prometheus-rules":
          return `groups:
  - name: ${promAlertGroup || "host-alerts"}
    rules:
      - alert: ${promAlertName || "HighCpuUsage"}
        expr: ${promExpr || "cpu_usage > 90"}
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Instance {{ $labels.instance }} has critical CPU usage"
          description: "CPU load exceeds threshold for over 5 minutes."`

        case "pm2-ecosystem":
          return `apps:
  - name: ${pm2AppName || "api-server"}
    script: ${pm2Script || "./dist/main.js"}
    instances: ${pm2Instances || "max"}
    exec_mode: cluster
    watch: false
    env:
      NODE_ENV: development
    env_production:
      NODE_ENV: production`

        case "app-config":
          const featuresList = (cfgFeatures || "auth, users")
            .split(",")
            .map(f => f.trim())
            .filter(Boolean)
          
          let featuresYaml = ""
          if (featuresList.length === 0) {
            featuresYaml = "[]"
          } else {
            featuresYaml = featuresList.map(f => `\n    - "${f}"`).join("")
          }

          return `app:
  name: "${cfgAppName || "my-service"}"
  version: "${cfgVersion || "1.0.0"}"
  environment: "${cfgEnv || "production"}"
  database:
    enabled: ${cfgDbEnabled}
    host: "127.0.0.1"
    port: 5432
  features:${featuresYaml}`

        default:
          return ""
      }
    } else {
      // Custom key-value generation
      let yaml = "---\n"
      customRows.forEach(row => {
        const k = row.key.trim()
        if (!k) return

        if (row.type === "string") {
          const val = row.value.replace(/"/g, '\\"')
          yaml += `${k}: "${val}"\n`
        } else if (row.type === "number") {
          const num = Number(row.value)
          yaml += `${k}: ${isNaN(num) ? 0 : num}\n`
        } else if (row.type === "boolean") {
          const bool = row.value.trim().toLowerCase() === "true"
          yaml += `${k}: ${bool}\n`
        } else if (row.type === "array") {
          const items = row.value
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
          
          if (items.length === 0) {
            yaml += `${k}: []\n`
          } else {
            yaml += `${k}:\n`
            items.forEach(item => {
              yaml += `  - "${item.replace(/"/g, '\\"')}"\n`
            })
          }
        }
      })
      return yaml.trim()
    }
  }, [
    generatorMode,
    selectedTemplate,
    dockerService,
    dockerImage,
    dockerRestart,
    dockerHostPort,
    dockerContainerPort,
    dockerEnvKey1,
    dockerEnvVal1,
    dockerEnvKey2,
    dockerEnvVal2,
    stackSvcName,
    stackSvcImage,
    stackDbName,
    stackDbPort,
    stackCacheName,
    stackCachePort,
    ghWorkflowName,
    ghBranch,
    ghNodeVersion,
    ghBuildCmd,
    ghTestCmd,
    glStages,
    glImage,
    glBuildCmd,
    glTestCmd,
    glDeployEnv,
    k8sPodName,
    k8sContainerName,
    k8sContainerImage,
    k8sPodPort,
    k8sCpuLimit,
    k8sMemLimit,
    k8sDepName,
    k8sDepReplicas,
    k8sDepImage,
    k8sDepPort,
    k8sSvcName,
    k8sSvcType,
    k8sSvcSelectorKey,
    k8sSvcSelectorVal,
    k8sSvcPort,
    k8sSvcTargetPort,
    k8sIngName,
    k8sIngHost,
    k8sIngSvcName,
    k8sIngSvcPort,
    k8sCmName,
    k8sCmKey,
    k8sCmVal,
    helmReplicas,
    helmRepo,
    helmTag,
    helmPort,
    slsName,
    slsRuntime,
    slsRegion,
    slsHttpPath,
    ansibleHosts,
    ansibleTaskName,
    ansiblePkg,
    apiTitle,
    apiVersion,
    apiPath,
    apiMethod,
    flutterName,
    flutterDesc,
    flutterSdk,
    promAlertGroup,
    promAlertName,
    promExpr,
    pm2AppName,
    pm2Script,
    pm2Instances,
    cfgAppName,
    cfgVersion,
    cfgEnv,
    cfgDbEnabled,
    cfgFeatures,
    customRows
  ])

  // Custom Rows Handlers
  const handleAddRow = () => {
    const nextId = String(customRows.length > 0 ? Math.max(...customRows.map(r => Number(r.id))) + 1 : 1)
    setCustomRows([...customRows, { id: nextId, key: "", value: "", type: "string" }])
  }

  const handleDeleteRow = (id: string) => {
    setCustomRows(customRows.filter(r => r.id !== id))
  }

  const handleUpdateRow = (id: string, updates: Partial<CustomRow>) => {
    setCustomRows(customRows.map(r => (r.id === id ? { ...r, ...updates } : r)))
  }

  const handleCopyGenerator = async () => {
    try {
      await navigator.clipboard.writeText(generatedYaml)
      setCopiedGenerator(true)
      setTimeout(() => setCopiedGenerator(false), 1500)
    } catch (err) {
      console.error("Failed to copy generator output:", err)
    }
  }

  const handleDownloadGenerator = () => {
    try {
      const element = document.createElement("a")
      const file = new Blob([generatedYaml], { type: "text/yaml" })
      element.href = URL.createObjectURL(file)
      element.download = generatorMode === "templates" ? `${selectedTemplate}.yaml` : "custom-config.yaml"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (err) {
      console.error("Failed to download file:", err)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
      {/* Controls Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="border-2 border-foreground bg-zinc-950 p-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4">
          <h2 className="text-xs font-black uppercase text-accent tracking-widest border-b border-zinc-800 pb-2">
            GENERATOR OPTIONS
          </h2>

          <div className="flex border border-zinc-800 p-1 bg-black gap-1 select-none">
            <button
              onClick={() => setGeneratorMode("templates")}
              className={`flex-1 text-center py-2 text-[10px] font-bold uppercase cursor-pointer transition-all ${
                generatorMode === "templates"
                  ? "bg-accent text-accent-foreground"
                  : "text-zinc-500 hover:text-foreground"
              }`}
            >
              CONFIG TEMPLATES
            </button>
            <button
              onClick={() => setGeneratorMode("custom")}
              className={`flex-1 text-center py-2 text-[10px] font-bold uppercase cursor-pointer transition-all ${
                generatorMode === "custom"
                  ? "bg-accent text-accent-foreground"
                  : "text-zinc-500 hover:text-foreground"
              }`}
            >
              CUSTOM KEY-VALUES
            </button>
          </div>
        </div>

        {generatorMode === "templates" ? (
          /* Config Templates Section */
          <div className="border-2 border-foreground bg-zinc-950 p-6 shadow-[4px_4px_0px_0px_var(--primary)] space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold block uppercase">
                CHOOSE TEMPLATE:
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
                className="w-full bg-black border-2 border-foreground text-foreground px-3 py-2 text-xs font-mono focus:outline-none"
              >
                <option value="docker-compose">Docker Compose (Single Service)</option>
                <option value="docker-compose-stack">Docker Compose Stack (Node + Postgres + Redis)</option>
                <option value="github-actions">GitHub Actions (Node Workflow)</option>
                <option value="gitlab-ci">GitLab CI/CD Pipeline</option>
                <option value="k8s-pod">Kubernetes Pod</option>
                <option value="k8s-deployment">Kubernetes Deployment</option>
                <option value="k8s-service">Kubernetes Service</option>
                <option value="k8s-ingress">Kubernetes Ingress</option>
                <option value="k8s-configmap">Kubernetes ConfigMap</option>
                <option value="helm-values">Helm chart values.yaml</option>
                <option value="serverless">Serverless Framework (serverless.yml)</option>
                <option value="ansible-playbook">Ansible Playbook</option>
                <option value="openapi-spec">OpenAPI 3.0 API Specification</option>
                <option value="flutter-pubspec">Flutter pubspec.yaml</option>
                <option value="prometheus-rules">Prometheus Alert Rules</option>
                <option value="pm2-ecosystem">PM2 Ecosystem Config</option>
                <option value="app-config">App Configuration</option>
              </select>
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-4">
              {/* Render template inputs */}
              {selectedTemplate === "docker-compose" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Service Name</label>
                      <input
                        type="text"
                        value={dockerService}
                        onChange={(e) => setDockerService(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Image</label>
                      <input
                        type="text"
                        value={dockerImage}
                        onChange={(e) => setDockerImage(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Host Port</label>
                      <input
                        type="text"
                        value={dockerHostPort}
                        onChange={(e) => setDockerHostPort(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Container Port</label>
                      <input
                        type="text"
                        value={dockerContainerPort}
                        onChange={(e) => setDockerContainerPort(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Restart Policy</label>
                    <select
                      value={dockerRestart}
                      onChange={(e) => setDockerRestart(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    >
                      <option value="always">always</option>
                      <option value="unless-stopped">unless-stopped</option>
                      <option value="on-failure">on-failure</option>
                      <option value="no">no</option>
                    </select>
                  </div>

                  <div className="space-y-2 border-t border-zinc-900 pt-2">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase block">Environment Variables</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="KEY"
                        value={dockerEnvKey1}
                        onChange={(e) => setDockerEnvKey1(e.target.value)}
                        className="bg-black border border-zinc-800 px-2 py-1 text-[11px] text-foreground focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="VALUE"
                        value={dockerEnvVal1}
                        onChange={(e) => setDockerEnvVal1(e.target.value)}
                        className="bg-black border border-zinc-800 px-2 py-1 text-[11px] text-foreground focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="KEY"
                        value={dockerEnvKey2}
                        onChange={(e) => setDockerEnvKey2(e.target.value)}
                        className="bg-black border border-zinc-800 px-2 py-1 text-[11px] text-foreground focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="VALUE"
                        value={dockerEnvVal2}
                        onChange={(e) => setDockerEnvVal2(e.target.value)}
                        className="bg-black border border-zinc-800 px-2 py-1 text-[11px] text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "docker-compose-stack" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Node API Name</label>
                      <input
                        type="text"
                        value={stackSvcName}
                        onChange={(e) => setStackSvcName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Image</label>
                      <input
                        type="text"
                        value={stackSvcImage}
                        onChange={(e) => setStackSvcImage(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Postgres Container Name</label>
                      <input
                        type="text"
                        value={stackDbName}
                        onChange={(e) => setStackDbName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Postgres Port</label>
                      <input
                        type="text"
                        value={stackDbPort}
                        onChange={(e) => setStackDbPort(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Redis Container Name</label>
                      <input
                        type="text"
                        value={stackCacheName}
                        onChange={(e) => setStackCacheName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Redis Port</label>
                      <input
                        type="text"
                        value={stackCachePort}
                        onChange={(e) => setStackCachePort(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "github-actions" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Workflow Name</label>
                    <input
                      type="text"
                      value={ghWorkflowName}
                      onChange={(e) => setGhWorkflowName(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Branch</label>
                      <input
                        type="text"
                        value={ghBranch}
                        onChange={(e) => setGhBranch(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Node Version</label>
                      <input
                        type="text"
                        value={ghNodeVersion}
                        onChange={(e) => setGhNodeVersion(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Build Command</label>
                    <input
                      type="text"
                      value={ghBuildCmd}
                      onChange={(e) => setGhBuildCmd(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Test Command</label>
                    <input
                      type="text"
                      value={ghTestCmd}
                      onChange={(e) => setGhTestCmd(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                </div>
              )}

              {selectedTemplate === "gitlab-ci" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Docker Image</label>
                      <input
                        type="text"
                        value={glImage}
                        onChange={(e) => setGlImage(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Deploy Env</label>
                      <input
                        type="text"
                        value={glDeployEnv}
                        onChange={(e) => setGlDeployEnv(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Stages (comma-separated)</label>
                    <input
                      type="text"
                      value={glStages}
                      onChange={(e) => setGlStages(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Build Script</label>
                      <input
                        type="text"
                        value={glBuildCmd}
                        onChange={(e) => setGlBuildCmd(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Test Script</label>
                      <input
                        type="text"
                        value={glTestCmd}
                        onChange={(e) => setGlTestCmd(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "k8s-pod" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Pod Name</label>
                      <input
                        type="text"
                        value={k8sPodName}
                        onChange={(e) => setK8sPodName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Container Name</label>
                      <input
                        type="text"
                        value={k8sContainerName}
                        onChange={(e) => setK8sContainerName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Docker Image</label>
                      <input
                        type="text"
                        value={k8sContainerImage}
                        onChange={(e) => setK8sContainerImage(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Container Port</label>
                      <input
                        type="text"
                        value={k8sPodPort}
                        onChange={(e) => setK8sPodPort(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">CPU Limit</label>
                      <input
                        type="text"
                        value={k8sCpuLimit}
                        onChange={(e) => setK8sCpuLimit(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Memory Limit</label>
                      <input
                        type="text"
                        value={k8sMemLimit}
                        onChange={(e) => setK8sMemLimit(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "k8s-deployment" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Deployment Name</label>
                      <input
                        type="text"
                        value={k8sDepName}
                        onChange={(e) => setK8sDepName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Replicas</label>
                      <input
                        type="number"
                        value={k8sDepReplicas}
                        onChange={(e) => setK8sDepReplicas(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Container Image</label>
                      <input
                        type="text"
                        value={k8sDepImage}
                        onChange={(e) => setK8sDepImage(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Port</label>
                      <input
                        type="text"
                        value={k8sDepPort}
                        onChange={(e) => setK8sDepPort(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "k8s-service" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Service Name</label>
                      <input
                        type="text"
                        value={k8sSvcName}
                        onChange={(e) => setK8sSvcName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Service Type</label>
                      <select
                        value={k8sSvcType}
                        onChange={(e) => setK8sSvcType(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      >
                        <option value="ClusterIP">ClusterIP</option>
                        <option value="NodePort">NodePort</option>
                        <option value="LoadBalancer">LoadBalancer</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Selector Key</label>
                      <input
                        type="text"
                        value={k8sSvcSelectorKey}
                        onChange={(e) => setK8sSvcSelectorKey(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Selector Value</label>
                      <input
                        type="text"
                        value={k8sSvcSelectorVal}
                        onChange={(e) => setK8sSvcSelectorVal(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Service Port</label>
                      <input
                        type="text"
                        value={k8sSvcPort}
                        onChange={(e) => setK8sSvcPort(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Target Port</label>
                      <input
                        type="text"
                        value={k8sSvcTargetPort}
                        onChange={(e) => setK8sSvcTargetPort(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "k8s-ingress" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Ingress Name</label>
                      <input
                        type="text"
                        value={k8sIngName}
                        onChange={(e) => setK8sIngName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Domain Host</label>
                      <input
                        type="text"
                        value={k8sIngHost}
                        onChange={(e) => setK8sIngHost(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Target Service Name</label>
                      <input
                        type="text"
                        value={k8sIngSvcName}
                        onChange={(e) => setK8sIngSvcName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Service Port</label>
                      <input
                        type="text"
                        value={k8sIngSvcPort}
                        onChange={(e) => setK8sIngSvcPort(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "k8s-configmap" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">ConfigMap Name</label>
                    <input
                      type="text"
                      value={k8sCmName}
                      onChange={(e) => setK8sCmName(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Parameter Key</label>
                      <input
                        type="text"
                        value={k8sCmKey}
                        onChange={(e) => setK8sCmKey(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Parameter Value</label>
                      <input
                        type="text"
                        value={k8sCmVal}
                        onChange={(e) => setK8sCmVal(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "helm-values" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Replica Count</label>
                      <input
                        type="number"
                        value={helmReplicas}
                        onChange={(e) => setHelmReplicas(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Service Port</label>
                      <input
                        type="text"
                        value={helmPort}
                        onChange={(e) => setHelmPort(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Image Repository</label>
                      <input
                        type="text"
                        value={helmRepo}
                        onChange={(e) => setHelmRepo(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Image Tag</label>
                      <input
                        type="text"
                        value={helmTag}
                        onChange={(e) => setHelmTag(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "serverless" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Service Name</label>
                      <input
                        type="text"
                        value={slsName}
                        onChange={(e) => setSlsName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Runtime Environment</label>
                      <input
                        type="text"
                        value={slsRuntime}
                        onChange={(e) => setSlsRuntime(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">AWS Region</label>
                      <input
                        type="text"
                        value={slsRegion}
                        onChange={(e) => setSlsRegion(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">HTTP Endpoint Route</label>
                      <input
                        type="text"
                        value={slsHttpPath}
                        onChange={(e) => setSlsHttpPath(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "ansible-playbook" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Hosts Group</label>
                    <input
                      type="text"
                      value={ansibleHosts}
                      onChange={(e) => setAnsibleHosts(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Task Name</label>
                      <input
                        type="text"
                        value={ansibleTaskName}
                        onChange={(e) => setAnsibleTaskName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Target Package</label>
                      <input
                        type="text"
                        value={ansiblePkg}
                        onChange={(e) => setAnsiblePkg(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "openapi-spec" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">API Title</label>
                      <input
                        type="text"
                        value={apiTitle}
                        onChange={(e) => setApiTitle(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Version</label>
                      <input
                        type="text"
                        value={apiVersion}
                        onChange={(e) => setApiVersion(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Route Path</label>
                      <input
                        type="text"
                        value={apiPath}
                        onChange={(e) => setApiPath(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">HTTP Method</label>
                      <select
                        value={apiMethod}
                        onChange={(e) => setApiMethod(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      >
                        <option value="get">GET</option>
                        <option value="post">POST</option>
                        <option value="put">PUT</option>
                        <option value="delete">DELETE</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "flutter-pubspec" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Application Name</label>
                    <input
                      type="text"
                      value={flutterName}
                      onChange={(e) => setFlutterName(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Description</label>
                    <input
                      type="text"
                      value={flutterDesc}
                      onChange={(e) => setFlutterDesc(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Dart SDK Constraint</label>
                    <input
                      type="text"
                      value={flutterSdk}
                      onChange={(e) => setFlutterSdk(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                </div>
              )}

              {selectedTemplate === "prometheus-rules" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Alert Group Name</label>
                    <input
                      type="text"
                      value={promAlertGroup}
                      onChange={(e) => setPromAlertGroup(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Alert Trigger Rule</label>
                      <input
                        type="text"
                        value={promAlertName}
                        onChange={(e) => setPromAlertName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Metric Expression</label>
                      <input
                        type="text"
                        value={promExpr}
                        onChange={(e) => setPromExpr(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === "pm2-ecosystem" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">App Name</label>
                      <input
                        type="text"
                        value={pm2AppName}
                        onChange={(e) => setPm2AppName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Run Instances</label>
                      <input
                        type="text"
                        value={pm2Instances}
                        onChange={(e) => setPm2Instances(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Script Path</label>
                    <input
                      type="text"
                      value={pm2Script}
                      onChange={(e) => setPm2Script(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                </div>
              )}

              {selectedTemplate === "app-config" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">App Name</label>
                      <input
                        type="text"
                        value={cfgAppName}
                        onChange={(e) => setCfgAppName(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Version</label>
                      <input
                        type="text"
                        value={cfgVersion}
                        onChange={(e) => setCfgVersion(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Environment</label>
                      <input
                        type="text"
                        value={cfgEnv}
                        onChange={(e) => setCfgEnv(e.target.value)}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 font-bold uppercase">Database Enabled</label>
                      <select
                        value={String(cfgDbEnabled)}
                        onChange={(e) => setCfgDbEnabled(e.target.value === "true")}
                        className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase">Features (Comma-separated list)</label>
                    <input
                      type="text"
                      value={cfgFeatures}
                      onChange={(e) => setCfgFeatures(e.target.value)}
                      className="w-full bg-black border border-zinc-700 px-2 py-1.5 focus:border-foreground focus:outline-none text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Custom Key-Values Section */
          <div className="border-2 border-foreground bg-zinc-950 p-5 shadow-[4px_4px_0px_0px_var(--primary)] space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">FIELDS SCHEMAS</span>
              <button
                onClick={handleAddRow}
                className="border-2 border-foreground bg-accent text-accent-foreground px-2 py-1 text-[9px] font-black uppercase cursor-pointer hover:bg-white flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>ADD ROW</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {customRows.map((row) => (
                <div
                  key={row.id}
                  className="border border-zinc-800 bg-black p-3 space-y-2 relative"
                >
                  <button
                    onClick={() => handleDeleteRow(row.id)}
                    className="absolute top-2 right-2 text-zinc-500 hover:text-red-500 cursor-pointer"
                    title="Remove key"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="grid grid-cols-12 gap-2 pr-6">
                    <div className="col-span-6">
                      <label className="text-[8px] text-zinc-500 font-bold block mb-1">KEY</label>
                      <input
                        type="text"
                        placeholder="e.g. timeout"
                        value={row.key}
                        onChange={(e) => handleUpdateRow(row.id, { key: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs px-2 py-1 text-foreground focus:outline-none focus:border-zinc-700 font-mono"
                      />
                    </div>
                    <div className="col-span-6">
                      <label className="text-[8px] text-zinc-500 font-bold block mb-1">TYPE</label>
                      <select
                        value={row.type}
                        onChange={(e) =>
                          handleUpdateRow(row.id, {
                            type: e.target.value as any,
                            value: e.target.value === "boolean" ? "true" : ""
                          })
                        }
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs px-1.5 py-1 text-foreground focus:outline-none focus:border-zinc-700 font-mono"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="array">Array (comma)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] text-zinc-500 font-bold block mb-1">VALUE</label>
                    {row.type === "boolean" ? (
                      <select
                        value={row.value}
                        onChange={(e) => handleUpdateRow(row.id, { value: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs px-2 py-1 text-foreground focus:outline-none focus:border-zinc-700 font-mono"
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder={
                          row.type === "array"
                            ? "item1, item2, item3"
                            : row.type === "number"
                            ? "42"
                            : "Value text"
                        }
                        value={row.value}
                        onChange={(e) => handleUpdateRow(row.id, { value: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs px-2 py-1 text-foreground focus:outline-none focus:border-zinc-700 font-mono"
                      />
                    )}
                  </div>
                </div>
              ))}

              {customRows.length === 0 && (
                <div className="text-center py-6 text-xs text-zinc-600 border border-dashed border-zinc-800">
                  No custom keys added yet. Add one above!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Output Display Column */}
      <div className="lg:col-span-7 space-y-4">
        <div className="border-4 border-foreground bg-black p-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative flex flex-col min-h-[520px]">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-3">
            <span className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-primary" />
              <span>YAML OUTPUT PREVIEW</span>
            </span>

            <div className="flex gap-2">
              <button
                onClick={handleCopyGenerator}
                className={`px-3 py-1 border text-[10px] font-black uppercase transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  copiedGenerator
                    ? "bg-accent text-accent-foreground border-foreground scale-95"
                    : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-foreground hover:border-foreground"
                }`}
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedGenerator ? "COPIED!" : "COPY"}</span>
              </button>

              <button
                onClick={handleDownloadGenerator}
                className="px-3 py-1 border border-zinc-700 bg-zinc-900 hover:text-foreground hover:border-foreground hover:bg-zinc-800 text-[10px] text-zinc-300 font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>DOWNLOAD</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs overflow-auto select-all whitespace-pre">
            <code className="text-green-400">{generatedYaml}</code>
          </div>
        </div>
      </div>
    </div>
  )
}
