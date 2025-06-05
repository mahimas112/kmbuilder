import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import LayoutComponent from '../layout/LayoutComponent';
import AdminDashboard from '../pages/dashboard/admindashboard/AdminDashboard';
import AgentDashboard from '../pages/dashboard/agentdashboard/AgentDashboard';
import ClientDashboard from '../pages/dashboard/clientdashboard/ClientDashboard';
import ManageCredential from '../pages/management/ManageCredential';
import MyProfile from '../components/MyProfile';
import AllProjects from '../components/Masters/Projects/AllProjects';
import AddProject from '../components/Masters/Projects/AddProjects';
import AddBlocks from '../components/Masters/Blocks/AddBlocks';
import AllBlocks from '../components/Masters/Blocks/AllBlocks';
import AllPlotTypes from '../components/Masters/PlotType/AllPlotType';
import PlotRateMaster from '../components/Masters/DevelopmentCharges/PlotRate';
import AllPlotDetails from '../components/Masters/PlotDetails/AllPlotDetails';
import ProjectManipulation from '../components/Masters/projectmanipulation/ProjectManipulation';
import AssociateForm from '../components/Associate/AddAssociate';
import HierarchicalTree from '../components/Associate/AssociateTree';
import AddEditEnquiry from '../components/LeadManagement/AddEnquiry';
import AllRanks from '../components/Rank/AllRanks';
import PlotAvailability from '../components/PlotAvailibility';
import FarmerManagementSystem from '../components/LandManagement/AddFarmer';
import PurchaseLandSystem from '../components/LandManagement/PurchaseLand';
import BrokerManagementSystem from '../components/LandManagement/AddBroker';
import AddPayment from '../components/LandManagement/AddPayment';
import AllAssociates from '../components/Associate/AllAssociate';
import RolePermissionsManagement from '../components/UserPermission/UserPermission';
import AddCustomer from '../components/Customer/AddCustomer';
import PlotBooking from '../components/PlotManagement/PlotBooking';
import PlotRegistryForm from '../components/Plotregistry/AddplotRegistry';
import FullTimePayment from '../components/Payment/FullTimePayment';
import FullPaymentForm from '../components/Payment/FullTimePayment';
import FullPaymentTable from '../components/Payment/AllFullTimePayment';
import EMIGenerator from '../components/Payment/EmiGenerator';
import AllPlotBookings from '../components/PlotManagement/AllPlotBookings';
import { Sources, LeadType, Lead } from '../components/lead-management';
import RealEstateDashboard from '../pages/dashboard/admindashboard/AdminDashboard';
import AssociateDashboard from '../pages/dashboard/AssociateDashboard';
import OTPVerificationPage from '../pages/auth/OtpVerificationPage';
import EmiPayment from '../components/Payment/EmiPayment';
import AllEmiPayments from '../components/Payment/AllEmiPayments';
import Practicecomponent from '../pages/Practicecomponent';
import ChequeClearance from '../components/Payment/CheckClearance';
import AllCustomers from '../components/Customer/AllCustomers';
import AssignEnquiryManager from '../components/lead-management/AssignEnquiry';
import AllEnquiries from '../components/lead-management/AllEnquiries';
import PendingEmi from '../components/Reports/PendingEmi';
import DownlineTree from '../components/Reports/DownlineTree';
import MonthEmi from '../components/Reports/MonthEmi';
import EmiBookPlot from '../components/Reports/EmiBookPlot';
import BounceCheque from '../components/Reports/BounceCheque';
import FullPaymentBookPlots from '../components/Reports/FullPaymentBookPlots';

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/otp",
      element: <OTPVerificationPage />,
    },
    {
      path: "/associate-dashboard",
      element: <LayoutComponent/>,
      children: [
        {
          index:true,
          element:<AssociateDashboard/>
        }
      ]
    },
    {
      path: '/user-permission',
      element: <LayoutComponent />,
      children: [
        {
          index: true,
          element: <RolePermissionsManagement />
        }
      ]
    },
    {
      path: 'dashboard',
      element: <LayoutComponent />,
      children: [
        {
          index: true,
          element: <RealEstateDashboard />,
        },
        {
          path: 'agent-dashboard',
          element: <AgentDashboard />,
        },
        {
          path: 'client-dashboard',
          element: <ClientDashboard />,
        },
        {
          path: 'manage-credential',
          element: <ManageCredential />,
        },
        {
          path: 'my-profile',
          element: <MyProfile />,
        },
      ],
    },
    {
      path: 'masters',
      element: <LayoutComponent />,
      children: [
        {
          path: 'all-projects-site',
          element: <AllProjects />
        },
        {
          path: 'add-project',
          element: <AddProject />
        },
        {
          path: 'all-blocks',
          element: <AllBlocks />
        },
        {
          path: 'all-plot-types',
          element: <AllPlotTypes />
        },
        {
          path: 'all-plot-rate-master',
          element: <PlotRateMaster />
        },
        {
          path: 'all-plot-details',
          element: <AllPlotDetails />
        },
        {
          path: 'project-manipulation',
          element: <ProjectManipulation />
        },
        {
          path: 'all-ranks',
          element: <AllRanks />
        },
        {
          path: 'plot-availibility',
          element: <PlotAvailability />
        },
        {
          path: 'practice',
          element: <Practicecomponent />
        },

      ]
    },
    {
      path: 'associates',
      element: <LayoutComponent />,
      children: [
        {
          path: 'add-associates',
          element: <AssociateForm />,
        },
        {
          path: 'all-associates',
          element: <AllAssociates />,
        },
        {
          path: 'associates-trees',
          element: <HierarchicalTree />,
        }
      ]
    }, {
      path: 'customers',
      element: <LayoutComponent />,
      children: [
        {
          path: 'add-customer',
          element: <AddCustomer />,
        },
        {
          path: 'all-customer',
          element: <AllCustomers />,
        }
      ]
    },{
      path: 'plots',
      element: <LayoutComponent />,
      children: [
        {
          path: 'all-plot-bookings',
          element: <AllPlotBookings />,
        },
        {
          path: 'add-plot-booking',
          element: <PlotBooking />,
        },
        {
          path: 'add-plot-registry',
          element: <PlotRegistryForm />,
        }
      ]
    },
    {
      path: 'payment',
      element: <LayoutComponent />,
      children: [
        {
          path: 'one-time-payment',
          element: <FullPaymentForm />,
        },
        {
          path: 'all-one-time-payment',
          element: <FullPaymentTable />,
        },
        {
          path: 'emi-payment',
          element: <EmiPayment />,
        },
        {
          path:'emi-generator',
          element:<EMIGenerator/>
        },
        {
          path:'all-emi-payments',
          element:<AllEmiPayments/>
        },
        {
          path: 'cheque-clearence',
          element: <ChequeClearance />,
        }
      ]
    },
    {
      path: 'leads',
      element: <LayoutComponent />,
      children: [
        {
          path: 'sources',
          element: <Sources />,
        },
        {
          path: 'lead-types',
          element: <LeadType />,
        },
        {
          path: 'all-leads',
          element: <Lead />,
        },
        {
          path: 'all-enquiry',
          element: <AllEnquiries />,
        },
        {
          path: 'all-assign-enquiry',
          element: <AssignEnquiryManager />,
        }
      ]
    }, {
      path: 'Land-Management',
      element: <LayoutComponent />,
      children: [
        {
          path: 'add-Broker',
          element: <BrokerManagementSystem />
        },
        {
          path: 'add-farmer',
          element: <FarmerManagementSystem />
        },
        {
          path: 'PurchaseLand',
          element: <PurchaseLandSystem />
        },
        {
          path: 'Add-Payment',
          element: <AddPayment />
        }
        
        
      ]
    },{
      path: 'Reports',
      element: <LayoutComponent />,
      children: [
        {
          path: 'pending-emi',
          element: <PendingEmi />
        },
        {
          path: 'down-line-tree',
          element: <DownlineTree />
        },
        {
          path: 'monthly-emi-payment',
          element: <MonthEmi />
        },
        {
          path: 'emi-book-plot',
          element: <EmiBookPlot />
        },
        {
          path: 'bounce-Cheque',
          element: <BounceCheque />
        },
        {
          path: 'full-payment-book-plots',
          element: <FullPaymentBookPlots />
        },

      ]
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default Routes;


