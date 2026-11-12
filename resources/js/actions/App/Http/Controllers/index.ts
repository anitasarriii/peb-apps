import BerandaController from './BerandaController'
import TentangKamiController from './TentangKamiController'
import ServisController from './ServisController'
import GaleriController from './GaleriController'
import KebijakanController from './KebijakanController'
import PortfolioController from './PortfolioController'
import PengadaanController from './PengadaanController'
import LaporanController from './LaporanController'
import BeritaAcaraController from './BeritaAcaraController'
import KontakController from './KontakController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    BerandaController: Object.assign(BerandaController, BerandaController),
TentangKamiController: Object.assign(TentangKamiController, TentangKamiController),
ServisController: Object.assign(ServisController, ServisController),
GaleriController: Object.assign(GaleriController, GaleriController),
KebijakanController: Object.assign(KebijakanController, KebijakanController),
PortfolioController: Object.assign(PortfolioController, PortfolioController),
PengadaanController: Object.assign(PengadaanController, PengadaanController),
LaporanController: Object.assign(LaporanController, LaporanController),
BeritaAcaraController: Object.assign(BeritaAcaraController, BeritaAcaraController),
KontakController: Object.assign(KontakController, KontakController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers