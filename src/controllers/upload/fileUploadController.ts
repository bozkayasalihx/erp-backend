import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import CsvParser from "../../scripts/parser/csvParser";

const DELIMITER = ";";
export default async function fileUpload(req: Request, res: Response) {
    const file = req.files?.file as UploadedFile;
    const parser = new CsvParser(DELIMITER);
    // const parsedData = parser.matcher();
}
