const validate = (schema, viewToRender = null) => {
    return (req,res,next) => {
        const parsed = schema.safeParse(req.body);
        if(!parsed.success){
            const error = parsed.error.issues?.[0];
            if(viewToRender){
                return res.status(400).render(viewToRender, {
                    error: error.message,
                    field: error.path[0]
                });
            }
            return res.status(400).json({
                message:error.message||`Invalid input`,
                field:error.path[0]||null});
        }

        req.validatedData = parsed.data;
        next();
    }
}

export default validate;