import { Route, Routes } from "react-router-dom";
import AddUser from "./AddUser";

function AdminRouter (){
    return (
        <Routes>
            <Route index path="/" />
            <Route path="/nouvelUtilisateur" element={<AddUser/>} />
        </Routes>
    );
};

export default AdminRouter;