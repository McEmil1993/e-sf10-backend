import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import {
  parseCreateStudentGuardianDto,
  parseCreateStudentDto,
  parseStudentIdParam,
  parseUpdateStudentGuardianDto,
  parseUpdateStudentInformationDto,
  parseUpdateStudentDto,
} from "./student.dto";
import { studentService } from "./student.service";

export const studentController = {
  async getStudentInformationLookups(_request: Request, response: Response): Promise<void> {
    const lookups = await studentService.getStudentInformationLookups();
    sendSuccess(response, 200, "Student information lookups fetched successfully.", lookups);
  },

  async getAllStudents(_request: Request, response: Response): Promise<void> {
    const students = await studentService.getAllStudents();
    sendSuccess(response, 200, "Students fetched successfully.", students);
  },

  async createStudent(request: Request, response: Response): Promise<void> {
    const payload = parseCreateStudentDto(request.body);
    const student = await studentService.createStudent(payload);
    sendSuccess(response, 201, "Student created successfully.", student);
  },

  async getStudentById(request: Request, response: Response): Promise<void> {
    const studentId = parseStudentIdParam(request.params.id);
    const student = await studentService.getStudentById(studentId);
    sendSuccess(response, 200, "Student fetched successfully.", student);
  },

  async updateStudent(request: Request, response: Response): Promise<void> {
    const studentId = parseStudentIdParam(request.params.id);
    const payload = parseUpdateStudentDto(request.body);
    const student = await studentService.updateStudent(studentId, payload);
    sendSuccess(response, 200, "Student updated successfully.", student);
  },

  async deleteStudent(request: Request, response: Response): Promise<void> {
    const studentId = parseStudentIdParam(request.params.id);
    await studentService.deleteStudent(studentId);
    sendSuccess(response, 200, "Student soft deleted successfully.");
  },

  async getStudentInformation(request: Request, response: Response): Promise<void> {
    const studentId = parseStudentIdParam(request.params.id);
    const information = await studentService.getStudentInformation(studentId);
    sendSuccess(response, 200, "Student information fetched successfully.", information);
  },

  async updateStudentInformation(request: Request, response: Response): Promise<void> {
    const studentId = parseStudentIdParam(request.params.id);
    const payload = parseUpdateStudentInformationDto(request.body);
    const information = await studentService.updateStudentInformation(studentId, payload);
    sendSuccess(response, 200, "Student information updated successfully.", information);
  },

  async getStudentGuardians(request: Request, response: Response): Promise<void> {
    const studentId = parseStudentIdParam(request.params.id);
    const guardians = await studentService.getStudentGuardians(studentId);
    sendSuccess(response, 200, "Student guardians fetched successfully.", guardians);
  },

  async createStudentGuardian(request: Request, response: Response): Promise<void> {
    const studentId = parseStudentIdParam(request.params.id);
    const payload = parseCreateStudentGuardianDto(request.body);
    const relation = await studentService.createStudentGuardian(studentId, payload);
    sendSuccess(response, 201, "Student guardian created successfully.", relation);
  },

  async updateStudentGuardian(request: Request, response: Response): Promise<void> {
    const studentId = parseStudentIdParam(request.params.id);
    const relationId = parseStudentIdParam(request.params.relationId, "relationId");
    const payload = parseUpdateStudentGuardianDto(request.body);
    const relation = await studentService.updateStudentGuardian(studentId, relationId, payload);
    sendSuccess(response, 200, "Student guardian updated successfully.", relation);
  },

  async deleteStudentGuardian(request: Request, response: Response): Promise<void> {
    const studentId = parseStudentIdParam(request.params.id);
    const relationId = parseStudentIdParam(request.params.relationId, "relationId");
    await studentService.deleteStudentGuardian(studentId, relationId);
    sendSuccess(response, 200, "Student guardian removed successfully.");
  },
};
