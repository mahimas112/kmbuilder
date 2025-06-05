// // import React, { useEffect, useState } from 'react';
// // import {
// //     Box,
// //     TextField,
// //     MenuItem,
// //     Select,
// //     InputLabel,
// //     FormControl,
// //     Typography,
// //     Button,
// // } from '@mui/material';
// // import axiosInstance from 'axiosInstance'
// // import { setDate } from 'date-fns';

// // const FormField = () => {
// //     const [inputValue, setInputValue] = useState('');
// //     const [selectValue, setSelectValue] = useState('');
// //     const [projects, setProjects] = useState([])

// //     const [formData, setFormData] = useState({
// //         name: '',
// //         age: 0,
// //         gender: '',
// //         projectId: '',
// //         projectName:''
// //     })


// //     const handleChange = (e) => {
// //         const { name, value } = e.target;

// //         console.log(name)
// //         console.log(value)
// //         console.log(e)
// //         setInputValue(value);
// //         setFormData((prev) => (
// //             {
// //                 ...prev,
// //                 [name]: value
// //             }))
// //         if(name === 'projectId')
// //         {
// //             const value = e.target.value
// //             const project = projects.find((project) => project.projectId === value)
// //             console.log(project)

// //             setFormData((prev) => (
// //                 {
// //                     ...prev,
// //                     projectName:project.siteName,
// //                     projectId:project.projectId
// //                 }
// //             ))
// //         }
// //     }

// //     const getAllProjects = async () => {
// //         try {
// //             const response = await axiosInstance.get(`https://app.ventureconsultancyservices.com/realEstate/project/getAll`)
// //             if (response.data && Array.isArray(response.data.data)) {
// //                 console.log(response.data.data)
// //                 setProjects(response.data.data)
// //             }
// //         } catch (error) {
// //             console.error(error)
// //         }
// //     }
// //     useEffect(() => {
// //         getAllProjects()
// //     }, [])

// //     const handleSubmit = (e) => {
// //         e.preventDefault()
// //         console.log(formData)
// //     }

// //     return (
// //         <Box
// //             sx={{
// //                 display: 'flex',
// //                 flexDirection: 'column',
// //                 gap: 2,
// //                 width: 300,
// //                 margin: 'auto',
// //                 mt: 4,
// //             }}
// //         >
// //             <Typography variant="h6">Custom Form Field</Typography>

// //             <TextField
// //                 label="Enter name"
// //                 variant="outlined"
// //                 name="name"
// //                 value={formData.name}
// //                 onChange={handleChange}
// //                 fullWidth
// //             />
// //             <TextField
// //                 label="Enter age"
// //                 variant="outlined"
// //                 name="age"
// //                 value={formData.age}
// //                 onChange={handleChange}
// //                 fullWidth
// //             />
// //             <TextField
// //                 label="Enter gender"
// //                 variant="outlined"
// //                 name="gender"
// //                 value={formData.gender}
// //                 onChange={handleChange}
// //                 fullWidth
// //             />

// //             <FormControl fullWidth>
// //                 <InputLabel id="select-label">Select Option</InputLabel>
// //                 <Select
// //                     labelId="select-label"
// //                     value={selectValue}
// //                     label="Select Option"
// //                     onChange={(e) => setSelectValue(e.target.value)}
// //                 >
// //                     <MenuItem value="option1">Option 1</MenuItem>
// //                     <MenuItem value="option2">Option 2</MenuItem>
// //                     <MenuItem value="option3">Option 3</MenuItem>
// //                 </Select>
// //             </FormControl>

// //             <FormControl fullWidth>
// //                 <InputLabel id="select-label">Select Option</InputLabel>
// //                 <Select
// //                     name='projectId'
// //                     labelId="select-label"
// //                     value={formData.projectId}
// //                     label="Select Option"
// //                     onChange={handleChange}
// //                 >
// //                     {projects.length > 0 ? (
// //                         projects.map((project) => (
// //                             <MenuItem key={project.projectId} value={project.projectId}>{project.siteName}</MenuItem>
// //                         ))
// //                     ) : (
// //                         <MenuItem value="">No Projects Found</MenuItem>
// //                     )}


// //                 </Select>
// //             </FormControl>
// //             <Button onClick={handleSubmit} variant='outlined'>submit</Button>
// //         </Box>
// //     );
// // };

// // export default FormField;



// import React, { useEffect, useState } from 'react';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Typography
// } from '@mui/material';
// import axiosInstance from 'axiosInstance';

// const PlotSellingTable = () => {
//     const [projects, setProjects] = useState([])
//     const [blocks, setBlocks] = useState([])
//     const [customers, setCustomers] = useState([])
//     const [associates, setAssociates] = useState([])
//     const [plots, setPlots] = useState([])

//     const [dummyJson, setDummyJson] = useState([
//         {
//             projectId: '29186bcc-c709-419b-a481-0346d7736620',
//             name: 'Mohd Zaid',
//             age: 12,
//             blockId:'7b9e62ca-58ec-40c0-a281-aa0e761e5873'
//         },
//         {
//             projectId: 3,
//             name: 'Mohd Zaid',
//             age: 12
//         },
//         {
//             projectId: 'b168dccd-5c90-479c-bf48-536bd24520df',
//             name: 'Mohd Zaid',
//             age: 12,
//             blockId:'af569cf1-7e28-4b5b-9ff4-1a13ed649d38`'
//         },
//         {
//             projectId: 7,
//             name: 'Mohd Zaid',
//             age: 12
//         },
//     ])

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [projectData, blockData, customerData, associateData] = await Promise.all([
//                     fetchProjects(),
//                     fetchBlocks(),
//                     fetchCustomers(),
//                     fetchAssociates()
//                 ])

//             }
//             catch (error) {
//                 console.error('Error Loading Initial Data', error)
//             }
//             finally {
//                 console.log("hello")
//             }
//         }
//         fetchData()
//     }, [])

//     const fetchProjects = async () => {
//         try {
//             const response = await axiosInstance.get('https://app.ventureconsultancyservices.com/realEstate/project/getAll')
//             if (response.data && Array.isArray(response.data.data) && response.data.status === 200) {
//                 console.log("All Projects", response.data.data)
//                 setProjects(response.data.data)
//             }
//         }
//         catch (error) {
//             console.error('Error to fetch Projects', error)
//         }
//     }

//     const fetchBlocks = async () => {
//         try {
//             const response = await axiosInstance.get('https://app.ventureconsultancyservices.com/realEstate/Block/getAllBlock')
//             if (response.data && Array.isArray(response.data.data) && response.data.status === 200) {
//                 console.log("All Blocks", response.data.data)
//                 setBlocks(response.data.data)
//             }
//         }
//         catch (error) {
//             console.error('error to load blocks', error)
//         }
//     }

//     const fetchCustomers = async () => {
//         try {
//             const response = await axiosInstance.get('https://app.ventureconsultancyservices.com/realEstate/addNew-customer/getAllCustomers')
//             if (response.data && Array.isArray(response.data.data) && response.data.status === 200) {
//                 console.log('All Customers', response.data.data)
//                 setCustomers(response.data.data)
//             }
//         } catch (error) {
//             console.error('error to load customer', error)
//         }
//     }

//     const fetchAssociates = async () => {
//         try {
//             const response = await axiosInstance.get('https://app.ventureconsultancyservices.com/realEstate/associate/getAll')
//             if (response.data && Array.isArray(response.data.data) && response.data.status === 200) {
//                 console.log('Associates', response.data.data)
//                 setAssociates(response.data.data)
//             }
//         } catch (error) {
//             console.error('error to fetch Associates', error)
//         }
//     }

//     useEffect(() => {
//         if (projects.length > 0 && blocks.length > 0 && customers.length > 0 && associates.length > 0) {
//             fetchProcessedData();
//         }
//     }, [projects, blocks, customers, associates]);

//     const fetchProcessedData = () => {
//         try {
//             const projectMap = new Map(projects.map((p) => [p.projectId, p]));
//             const blockMap = new Map(blocks.map((b) => [b.blockId,b]))

//             const enrichedData = dummyJson.map((item) => {
//                 const project = projectMap.get(item.projectId);
//                 const block = blockMap.get(item.blockId)
//                 return {
//                     ...item,
//                     projectName: project?.siteName || 'Unknown Project',
//                     blockName : block?.block || 'unknown Blocks'
//                 };
//             });

//             setPlots(enrichedData); // or setDummyJson(enrichedData) if keeping original
//         } catch (error) {
//             console.error('Error enriching data', error);
//         }
//     };





//     return (
//         <TableContainer component={Paper} sx={{ mt: 4 }}>
//             <Typography variant="h6" sx={{ p: 2 }}>Plot Selling Details</Typography>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Booking Code</TableCell>
//                         <TableCell>Buyer Name</TableCell>
//                         <TableCell>Project Name</TableCell>
//                         <TableCell>Block Name</TableCell>
//                         <TableCell>Plot No</TableCell>
//                         <TableCell>Plot Area</TableCell>
//                         <TableCell>Rate</TableCell>
//                         <TableCell>Total Cost</TableCell>
//                         <TableCell>Final Payable</TableCell>
//                         <TableCell>Booking Amount</TableCell>
//                         <TableCell>Due Amount</TableCell>
//                         <TableCell>Plan Type</TableCell>
//                         <TableCell>Pay Mode</TableCell>
//                         <TableCell>Booking Date</TableCell>
//                         <TableCell>Remark</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {plots.map((row) => (
//                         <TableRow >
//                             <TableCell></TableCell>
//                             <TableCell>{row.buyerName}</TableCell>
//                             <TableCell>{row.projectName}</TableCell>
//                             <TableCell>{row.blockName}</TableCell>
//                             <TableCell>{row.plotNo}</TableCell>
//                             <TableCell>{row.ploatArea}</TableCell>
//                             <TableCell>{row.plotRate}</TableCell>
//                             <TableCell>{row.totalPlotCost}</TableCell>
//                             <TableCell>{row.finalPaybleAmount}</TableCell>
//                             <TableCell>{row.bookingAmount}</TableCell>
//                             <TableCell>{row.dueAmount}</TableCell>
//                             <TableCell>{row.planType}</TableCell>
//                             <TableCell>{row.payMode}</TableCell>
//                             <TableCell>{row.bookingDate}</TableCell>
//                             <TableCell>{row.remark}</TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// };

// export default PlotSellingTable;



import React, { useState } from 'react';
import {
    Box,
    TextField,
    Grid,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Button
} from '@mui/material';

const CustomerFormUI = () => {
    const [formData, setFormData] = useState({
        customerId: '',
        associateCode: '',
        customerName: '',
        title: '',
        swdOf: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        pinCode: '',
        city: '',
        state: '',
        emailId: '',
        mobileNo: '',
        panOrAddharNo: '',
        occupation: '',
        nationality: '',
        nomineeName: '',
        relation: '',
        profilePic: null,
        uploadAddhaarCard: null,
        userVisitType: '',
        associateName: ''
    })

    const handleChange = (e) => {
        const {name,value} = e.target
        setFormData({...formData, [name]: value})
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Customer Registration
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Customer ID" name="customerId" value={formData.customerId} onChange={handleChange}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Associate Code" name="associateCode" />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Customer Name" name="customerName" value={formData.customerName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Title" name="title" value={formData.customerId} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="S/W/D of" name="swdOf" value={formData.customerId} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.customerId}
                        InputLabelProps={{ shrink: true }}

                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select name="gender" label="Gender" value={formData.customerId}>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Address" name="address" value={formData.customerId} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Pin Code" name="pinCode" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="City" name="city" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="State" name="state" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Email ID" name="emailId" type="email" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Mobile No" name="mobileNo" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="PAN or Aadhaar No" name="panOrAddharNo" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Occupation" name="occupation" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Nationality" name="nationality" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Nominee Name" name="nomineeName" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Relation with Nominee" name="relation" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="User Visit Type" name="userVisitType" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Associate Name" name="associateName" value={formData.customerId}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button variant="outlined" component="label" fullWidth>
                        Upload Profile Picture
                        <input type="file" hidden name="profilePic" />
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button variant="outlined" component="label" fullWidth>
                        Upload Aadhaar Card
                        <input type="file" hidden name="uploadAddhaarCard" />
                    </Button>
                </Grid>
            </Grid>

            <Box mt={4}>
                <Button variant="contained" color="primary">
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

export default CustomerFormUI;
