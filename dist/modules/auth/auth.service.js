"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthenticationService {
    constructor() { }
    signup = (req, res) => {
        let { username, email, password } = req.body;
        console.log({ username, email, password });
        return res.status(201).json({ message: "Done", data: req.body });
    };
    login = (req, res) => {
        return res.json({ message: "Done", data: req.body });
    };
}
exports.default = new AuthenticationService();
//# sourceMappingURL=auth.service.js.map