import { Route, Routes } from "react-router-dom";
import AddUser from "./AddUser";
import ListeMembres from "./ListeMembers";

function AdminRouter (){
    return (
        <Routes>
            <Route index path="/" element={ListeMembres}/>
            <Route path="/nouvelUtilisateur" element={<AddUser/>} />
        </Routes>
    );
};

export default AdminRouter;