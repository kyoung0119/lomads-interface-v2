// eslint-disable-next-line no-unused-vars
import LandingLayout from 'layouts/LandingLayout';
import DashboardLayout from 'layouts/DashboardLayout';
import SettingsLayout from 'layouts/SettingsLayout';

import LoginPage from 'pages/Login';
import DashboardPage from 'pages/Dashboard';
import CreateProjectPage from 'pages/Project/CreateProject';
import ProjectDetailsPage from 'pages/Project/ProjectDetails';
import TaskDetailsPage from 'pages/Task/TaskDetails';
import SettingsPage from 'pages/Settings';
import AttachNewSafePage from 'pages/AttachSafe/New';
import AttachExistingSafePage from 'pages/AttachSafe/Existing';

export default [
	{
		path: '/login',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: LoginPage
	},
	{
		path: '/:daoURL/attach-safe/new',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: AttachNewSafePage
	},
	{
		path: '/:daoURL/attach-safe/existing',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: AttachExistingSafePage
	},
	{
		path: '/:daoURL/project',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: DashboardPage
	},
	{
		path: '/:daoURL/settings',
		exact: true,
		layout: SettingsLayout,
		private: true,
		component: SettingsPage
	},
	{
		path: '/',
		exact: true,
		layout: DashboardLayout,
		private: true,
		component: DashboardPage
	},
	{
		path: '/:daoURL',
		exact: true,
		layout: DashboardLayout,
		private: true,
		component: DashboardPage
	},
	{
		path: '/:daoURL/createProject',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: CreateProjectPage
	},
	{
		path: '/:daoURL/project/:projectId',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: ProjectDetailsPage
	},
	{
		path: '/:daoURL/task/:taskId',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: TaskDetailsPage
	},
];
