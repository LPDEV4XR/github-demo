"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.SearchDTO = exports.UserDTO = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UserDTO {
    user;
}
exports.UserDTO = UserDTO;
__decorate([
    (0, class_validator_1.Length)(1, 64),
    __metadata("design:type", String)
], UserDTO.prototype, "user", void 0);
class SearchDTO {
    id;
    name;
    description;
    language;
    username;
}
exports.SearchDTO = SearchDTO;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SearchDTO.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsAscii)(),
    __metadata("design:type", String)
], SearchDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsAscii)(),
    __metadata("design:type", String)
], SearchDTO.prototype, "language", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchDTO.prototype, "username", void 0);
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async registerUserAndRepos(user) {
        console.log(user);
        const $user = await this.userService.registerUserAndRepos(user.user);
        if ($user) {
            return;
        }
        else {
            throw new common_1.HttpException('No user with that username.', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getReposByUser(user) {
        return this.userService.getReposByUser(user.user);
    }
    async searchForRepos(query) {
        return this.userService.searchForRepos(query);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('/users/:user'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUserAndRepos", null);
__decorate([
    (0, common_1.Get)('/repos/:user'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getReposByUser", null);
__decorate([
    (0, common_1.Get)('/search'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchForRepos", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map