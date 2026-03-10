-- Passwords are BCrypt encoded 'password123'
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@scrumkanban.com', '$2a$10$HZt9.4wSULy.4G9YRu/2cOEkwLeIgYHCj8yd8LIZd2bnrW5YZ74l.', 'Admin User', 'ADMIN'),
('scrum_master', 'sm@scrumkanban.com', '$2a$10$HZt9.4wSULy.4G9YRu/2cOEkwLeIgYHCj8yd8LIZd2bnrW5YZ74l.', 'Sarah Master', 'SCRUM_MASTER'),
('dev1', 'dev1@scrumkanban.com', '$2a$10$HZt9.4wSULy.4G9YRu/2cOEkwLeIgYHCj8yd8LIZd2bnrW5YZ74l.', 'John Developer', 'DEVELOPER'),
('dev2', 'dev2@scrumkanban.com', '$2a$10$HZt9.4wSULy.4G9YRu/2cOEkwLeIgYHCj8yd8LIZd2bnrW5YZ74l.', 'Jane Developer', 'DEVELOPER');

-- Sample project
INSERT INTO projects (name, description, owner_id) VALUES
('E-Commerce Platform', 'Build a modern e-commerce platform with microservices architecture', 1);

-- Add members
INSERT INTO project_members (project_id, user_id) VALUES (1, 2), (1, 3), (1, 4);

-- Labels
INSERT INTO labels (name, color, project_id) VALUES
('Bug', '#e74c3c', 1),
('Feature', '#2ecc71', 1),
('Enhancement', '#3498db', 1),
('Documentation', '#9b59b6', 1),
('Technical Debt', '#f39c12', 1);

-- Sprint
INSERT INTO sprints (name, goal, project_id, start_date, end_date, status) VALUES
('Sprint 1', 'Set up project foundation and core user features', 1, '2025-03-10', '2025-03-24', 'ACTIVE');

-- Tasks across different statuses
INSERT INTO tasks (title, description, status, priority, story_points, sprint_id, project_id, reporter_id) VALUES
('Setup CI/CD Pipeline', 'Configure GitHub Actions for automated builds and deployments', 'DONE', 'HIGH', 5, 1, 1, 1),
('User Registration API', 'Implement user registration endpoint with validation', 'DONE', 'HIGHEST', 8, 1, 1, 2),
('User Login API', 'Implement JWT-based authentication', 'CODE_REVIEW', 'HIGHEST', 8, 1, 1, 2),
('Product Listing Page', 'Create responsive product grid with filtering', 'IN_PROGRESS', 'HIGH', 13, 1, 1, 2),
('Shopping Cart', 'Implement add to cart, update quantity, remove items', 'IN_PROGRESS', 'HIGH', 8, 1, 1, 2),
('Payment Integration', 'Integrate Stripe payment gateway', 'TODO', 'HIGHEST', 13, 1, 1, 1),
('Order History Page', 'Show user order history with status tracking', 'TODO', 'MEDIUM', 5, 1, 1, 2),
('Email Notifications', 'Send order confirmation and shipping updates', 'BACKLOG', 'LOW', 5, 1, 1, 1),
('Product Search', 'Implement full-text search with Elasticsearch', 'BACKLOG', 'MEDIUM', 8, 1, 1, 2),
('Admin Dashboard', 'Create admin panel for managing products and orders', 'TESTING', 'HIGH', 13, 1, 1, 1);

-- Task assignments
INSERT INTO task_assignments (task_id, user_id) VALUES
(1, 3), (2, 3), (3, 3), (4, 4), (5, 3), (5, 4), (6, 3), (7, 4), (10, 4);

-- Task labels
INSERT INTO task_labels (task_id, label_id) VALUES
(1, 5), (2, 2), (3, 2), (4, 2), (5, 2), (6, 2), (7, 2), (8, 3), (9, 3), (10, 2);

-- Comments
INSERT INTO comments (content, task_id, author_id) VALUES
('Pipeline is set up with build, test, and deploy stages', 1, 3),
('Added input validation and duplicate email check', 2, 3),
('JWT implementation complete, needs security review', 3, 3),
('Using a 12-column grid layout with Material cards', 4, 4),
('Should we use Redis for cart persistence?', 5, 2),
('Yes, Redis would be a good choice for session-based carts', 5, 1);
