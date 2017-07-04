export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must log in to continue!");
    res.redirect("/auth/login");
}
