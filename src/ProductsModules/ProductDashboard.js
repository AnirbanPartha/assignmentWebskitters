import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import DialogContentText from "@mui/material/DialogContentText";
import DialogBox from "../component/Dialog";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { addProduct } from "../redux/actions/product";
import { updateProductById } from "../redux/actions/product";
import { deleteProduct } from "../redux/actions/product";
// import { addProduct } from "../redux/actions/product";
import { useSelector, useDispatch } from "react-redux";
import firebase from "../firebase";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
// useSelector(state => console.log(state));

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "offerPrice",
    numeric: true,
    disablePadding: false,
    label: "Offer Price",
  },
  {
    id: "operation",
    numeric: true,
    disablePadding: false,
    label: "Operation",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = (props) => {
  const { handleClickOpen } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        All Products
      </Typography>

      <Tooltip title="Add Product" onClick={handleClickOpen}>
        <IconButton>
          <AddBusinessIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

export default function ProductDashboard() {
  const dispatch = useDispatch();
  const store = useSelector((store) => store);
  console.log("StoreData: " + JSON.stringify(store.productData.product));
  const rows = store.productData.product;
  // [
  //   {
  //     name: "static arry data",
  //     price: "static arry data",
  //     offerPrice: "static arry data",
  //   },
  // ];
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [productDataJson, setProductDataJson] = React.useState({
    id: uuidv4(),
    name: "",
    price: "",
    offerPrice: "",
    image: "",
    img:""
  });
  const [selectedData, setSelectedData] = React.useState({
    id: "",
    name: "",
    price: "",
    offerPrice: "",
    image: "",
    img:""
  });
  const [editDialog, setEditDialog] = React.useState(false);
  const [viewDialog, setViewDialog] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    file: null
  });
  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
    // getData();
    console.log("Rows data: " + JSON.stringify(rows) + ", " + rows.length);
  }, [open, rows]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
    // setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = async(evt) => {
    if(evt.target.name == "image"){
      // console.log(evt.target.files[0]);
      let { file } = uploadedFiles;

      file = evt.target.files[0];

      getBase64(file)
      .then((result) => {
        console.log(result);
        setUploadedFiles({
          file:result
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
      setProductDataJson({
        ...productDataJson,
        [evt.target.name]: evt.target.value,
      });
  };
  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = '';
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        // console.log('Called', reader);
        baseURL = reader.result;
        // console.log(baseURL);
        resolve(baseURL);
      };
      // console.log('fileInfo--->', fileInfo);
    });
  };
  const handleChangeEdit = (evt) => {
    if(evt.target.name == "image"){
      // console.log(evt.target.files[0]);
      let { file } = uploadedFiles;

      file = evt.target.files[0];

      getBase64(file)
      .then((result) => {
        console.log(result);
        setUploadedFiles({
          file:result
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
    setSelectedData({
      ...selectedData,
      [evt.target.name]: evt.target.value,
    });
  };

  const onSubmit = () => {
    try {
      // console.log("productDataJson====>", productDataJson);
      var json = productDataJson;
      json.img = uploadedFiles.file;
      // setProductDataJson({...productDataJson, image: uploadedFiles.file});
      dispatch(addProduct(productDataJson.id,json));
      setOpen(false);
      setUploadedFiles({file:null});
      setProductDataJson({
        id: uuidv4(),
        name: "",
        price: "",
        offerPrice: "",
        image: "",
        img:""
      });
    } catch (error) {}
  };
  const onEdit = () => {
    try {
      // console.log("productDataJson====>", productDataJson);
      var json = selectedData;
      json.img = uploadedFiles.file;
      dispatch(updateProductById(selectedData.id, json));
      setEditDialog(false);
      setUploadedFiles({file:null});
      setSelectedData({
        id: "",
        name: "",
        price: "",
        offerPrice: "",
        image: "",
        img:""
      })
    } catch (error) {}
  };
  return (
    <Box sx={{ width: "100%" }}>
      
      <Paper sx={{ width: 1000, mb: 2 }}>
        <EnhancedTableToolbar handleClickOpen={handleClickOpen} />
        {rows.length >0 ?
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell padding="none"></TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                      <TableCell align="right">{row.offerPrice}</TableCell>
                      <TableCell align="right">
                        <Tooltip
                          title="View Product"
                          onClick={() => {setViewDialog(true); setSelectedData(row)}}
                        >
                          <IconButton>
                            <RemoveRedEyeIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title="Edit Product"
                          onClick={() => {setEditDialog(true); setSelectedData(row); setUploadedFiles({file:row.img});}}
                        >
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="Delete Product"
                          onClick={() => {dispatch(deleteProduct(row.id, row));setUploadedFiles({file:null});}}
                        >
                          <IconButton>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>: null}
        {rows.length > 0 ?
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> : null}
      </Paper> 

      <DialogBox openPopup={open} title={`Add Product`}>
        <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box noValidate sx={{ mt: 3 }}>
                <form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="name"
                        required
                        fullWidth
                        id="firstName"
                        label="Name"
                        autoFocus
                        value={productDataJson.name}
                        onChange={(e) => handleChange(e)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="price"
                        label="Price"
                        name="price"
                        type="number"
                        value={productDataJson.price}
                        onChange={(e) => handleChange(e)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Offer Price"
                        name="offerPrice"
                        type="number"
                        value={productDataJson.offerPrice}
                        onChange={(e) => handleChange(e)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="image"
                        id="img1"
                        type="file"
                        value={productDataJson.image}
                        onChange={(e) => handleChange(e)}
                      />
                    </Grid>
                  </Grid>
                </form>
                <Grid
                  item
                  xs={12}
                  style={{
                    margin: "10px",
                    padding: "2px",
                    float: "right",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, mr: 2 }}
                    color="error"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={onSubmit}
                  >
                    Add
                  </Button>
                </Grid>
              </Box>
            </Box>
          </Container>
        </DialogContentText>
      </DialogBox>

      <DialogBox openPopup={editDialog} title={`Edit Products`}>
        <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box noValidate sx={{ mt: 3 }}>
                <form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="name"
                        required
                        fullWidth
                        id="firstName"
                        label="Name"
                        autoFocus
                        value={selectedData.name}
                        onChange={(e) => handleChangeEdit(e)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="price"
                        label="Price"
                        name="price"
                        type="number"
                        value={selectedData.price}
                        onChange={(e) => handleChangeEdit(e)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Offer Price"
                        name="offerPrice"
                        type="number"
                        value={selectedData.offerPrice}
                        onChange={(e) => handleChangeEdit(e)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="image"
                        type="file"
                        // value={selectedData.image}
                        onChange={(e) => handleChangeEdit(e)}
                      />
                    </Grid>
                  </Grid>
                </form>
                <Grid
                  item
                  xs={12}
                  style={{
                    margin: "10px",
                    padding: "2px",
                    float: "right",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, mr: 2 }}
                    color="error"
                    onClick={() => setEditDialog(false)}
                  >
                    Close
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={onEdit}
                  >
                    Edit
                  </Button>
                </Grid>
              </Box>
            </Box>
          </Container>
        </DialogContentText>
      </DialogBox>

      <DialogBox openPopup={viewDialog} title={`Add Products`}>
        <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="name"
                      fullWidth
                      id="firstName"
                      label="Name"
                      value={selectedData.name}
                      autoFocus
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="price"
                      label="Price"
                      value={selectedData.price}
                      name="price"
                      type="number"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Offer Price"
                      name="offerPrice"
                      value={selectedData.offerPrice}
                      type="number"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <img
                      src={selectedData.img}
                      alt="image"
                      width={"100%"}
                    /> */}
                    {selectedData.image != "" && selectedData.img != null ?
                    <img src={selectedData.img} alt="image" width={"100%"}/> : null}
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    margin: "10px",
                    padding: "2px",
                    float: "right",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, mr: 2 }}
                    color="error"
                    onClick={() => setViewDialog(false)}
                  >
                    Close
                  </Button>
                </Grid>
              </Box>
            </Box>
          </Container>
        </DialogContentText>
      </DialogBox>
    </Box>
  );
}
