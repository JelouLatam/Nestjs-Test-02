#!/bin/bash

# Docker management script for NestJS Todo App
# Usage: ./docker-commands.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Show usage information
show_usage() {
    echo "Usage: ./docker-commands.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  up            - Start all services in production mode"
    echo "  dev           - Start all services in development mode"  
    echo "  down          - Stop all services"
    echo "  restart       - Restart all services"
    echo "  logs          - Show logs from all services"
    echo "  logs-app      - Show only app logs"
    echo "  build         - Build the application image"
    echo "  clean         - Remove all containers, images, and volumes"
    echo "  reset         - Clean and rebuild everything"
    echo "  shell         - Open shell in app container"
    echo "  mysql         - Connect to MySQL database"
    echo "  redis         - Connect to Redis CLI"
    echo "  status        - Show status of all services"
    echo "  help          - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-commands.sh up"
    echo "  ./docker-commands.sh dev"
    echo "  ./docker-commands.sh logs-app"
}

# Check if docker and docker-compose are installed
check_requirements() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
}

# Start services in production mode
start_production() {
    print_info "Starting services in production mode..."
    docker-compose up -d
    print_success "Services started successfully!"
    print_info "Application will be available at: http://localhost:3000"
    print_info "API documentation at: http://localhost:3000/api"
}

# Start services in development mode
start_development() {
    print_info "Starting services in development mode..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
    print_success "Development services started successfully!"
    print_info "Application will be available at: http://localhost:3001"
    print_info "API documentation at: http://localhost:3001/api"
    print_info "Redis Commander at: http://localhost:8081"
    print_info "Adminer (DB GUI) at: http://localhost:8080"
}

# Stop all services
stop_services() {
    print_info "Stopping all services..."
    docker-compose down
    print_success "All services stopped!"
}

# Restart all services
restart_services() {
    print_info "Restarting all services..."
    docker-compose restart
    print_success "All services restarted!"
}

# Show logs
show_logs() {
    print_info "Showing logs from all services..."
    docker-compose logs -f
}

# Show only app logs
show_app_logs() {
    print_info "Showing application logs..."
    docker-compose logs -f nestjs-app
}

# Build the application
build_app() {
    print_info "Building application image..."
    docker-compose build nestjs-app
    print_success "Application built successfully!"
}

# Clean everything
clean_all() {
    print_warning "This will remove all containers, images, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleaning up..."
        docker-compose down -v --rmi all --remove-orphans
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_info "Cleanup cancelled"
    fi
}

# Reset everything
reset_all() {
    print_info "Resetting everything..."
    clean_all
    build_app
    start_production
}

# Open shell in app container
open_shell() {
    print_info "Opening shell in application container..."
    docker-compose exec nestjs-app /bin/sh
}

# Connect to MySQL
connect_mysql() {
    print_info "Connecting to MySQL database..."
    docker-compose exec mysql mysql -u todouser -ptodopassword todoapp
}

# Connect to Redis
connect_redis() {
    print_info "Connecting to Redis CLI..."
    docker-compose exec redis redis-cli
}

# Show status of all services
show_status() {
    print_info "Service status:"
    docker-compose ps
}

# Main command handler
case ${1} in
    up)
        check_requirements
        start_production
        ;;
    dev)
        check_requirements
        start_development
        ;;
    down)
        check_requirements
        stop_services
        ;;
    restart)
        check_requirements
        restart_services
        ;;
    logs)
        check_requirements
        show_logs
        ;;
    logs-app)
        check_requirements
        show_app_logs
        ;;
    build)
        check_requirements
        build_app
        ;;
    clean)
        check_requirements
        clean_all
        ;;
    reset)
        check_requirements
        reset_all
        ;;
    shell)
        check_requirements
        open_shell
        ;;
    mysql)
        check_requirements
        connect_mysql
        ;;
    redis)
        check_requirements
        connect_redis
        ;;
    status)
        check_requirements
        show_status
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac