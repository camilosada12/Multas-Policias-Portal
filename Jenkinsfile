pipeline {
    agent any

    environment {
        WORKSPACE_DIR = '/workspace/Front'
    }

    stages {

        // -------------------------------------------------------
        // 1️⃣ detectar entorno según la rama
        // -------------------------------------------------------
        stage('Detectar entorno por rama') {
            steps {
                script {
                    echo "🔍 detectando entorno según la rama..."
                    def branch = env.BRANCH_NAME?.toLowerCase() ?: "develop"

                    switch (branch) {
                        case 'main':
                            env.ENVIRONMENT = 'prod'
                            env.BUILD_ENV = 'production'
                            break
                        case 'qa':
                            env.ENVIRONMENT = 'qa'
                            env.BUILD_ENV = 'qa'
                            break
                        case 'staging':
                            env.ENVIRONMENT = 'staging'
                            env.BUILD_ENV = 'staging'
                            break
                        default:
                            env.ENVIRONMENT = 'dev'
                            env.BUILD_ENV = 'development'
                            break
                    }

                    env.ENV_DIR = "${WORKSPACE_DIR}/environments/${env.ENVIRONMENT}"
                    env.COMPOSE_FILE = "${env.ENV_DIR}/docker-compose.yml"
                    env.ENV_FILE = "${env.ENV_DIR}/.env"

                    echo "✅ rama detectada: ${branch}"
                    echo "📦 entorno asignado: ${env.ENVIRONMENT}"
                    echo "📄 docker-compose FRONT: ${env.COMPOSE_FILE}"
                    echo "📁 archivo .env: ${env.ENV_FILE}"
                }
            }
        }

        // -------------------------------------------------------
        // 2️⃣ instalación dependencias
        // -------------------------------------------------------
       stage('Instalar dependencias Front') {
            steps {
                dir("${WORKSPACE_DIR}") {
                    echo "📦 instalando dependencias..."
                    sh 'ls -la'
                    sh 'npm ci'
                }
            }
        }


        // -------------------------------------------------------
        // 3️⃣ construir angular con su entorno
        // -------------------------------------------------------
        stage('Construir Angular') {
            steps {
                dir("${WORKSPACE_DIR}") {
                    echo "⚙️ construyendo angular para entorno ${env.BUILD_ENV}..."
                    sh "npm run build -- --configuration=${env.BUILD_ENV}"
                }
            }
        }

        // -------------------------------------------------------
        // 4️⃣ levantar contenedor con docker compose
        // -------------------------------------------------------
        stage('Levantar contenedor Front') {
            steps {
                echo "🚀 levantando contenedor FRONT (${env.ENVIRONMENT})..."
                sh """
                    cd ${WORKSPACE_DIR}
                    docker network create multas_network || echo '🔹 red ya existe'
                    docker compose -f ${env.COMPOSE_FILE} --env-file ${env.ENV_FILE} up -d --build
                """
            }
        }

        // -------------------------------------------------------
        // 5️⃣ verificar estado
        // -------------------------------------------------------
        stage('Verificar contenedores') {
            steps {
                echo "🐳 contenedores activos:"
                sh 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
            }
        }
    }

    post {
        success {
            echo "🎉 despliegue FRONT exitoso (${env.ENVIRONMENT})"
        }
        failure {
            echo "💥 error durante el despliegue FRONT (${env.ENVIRONMENT})"
        }
    }
}
