import ProfileController from './ProfileController'
import NotificationController from './NotificationController'
import SecurityController from './SecurityController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
NotificationController: Object.assign(NotificationController, NotificationController),
SecurityController: Object.assign(SecurityController, SecurityController),
}

export default Settings