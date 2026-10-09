import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './services.entity';
import slugify from 'slugify';
import { Category } from 'src/Category/category.entity';
import { CreateServiceDto } from './dtos/create-services.dto';
import { UpdateServiceDto } from './dtos/update-services.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepository: Repository<Service>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }


    async create(createServiceDto: CreateServiceDto,categoryId: string): Promise<Service> {
        const {
            name,
            description,
            price,
            duration,
            isActive,
        } = createServiceDto;

        const slug = slugify(name, {
            lower: true,
            strict: true,
        });

        const serviceExists = await this.serviceRepository.findOne({
            where: { slug },
        });

        if (serviceExists) {
            throw new BadRequestException('Service already exists');
        }

        const category = await this.categoryRepository.findOne({
            where: { id: categoryId },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        const service = this.serviceRepository.create({
            name,
            slug,
            description,
            price,
            duration,
            isActive,
            category,
        });

        return await this.serviceRepository.save(service);
    }


    async getAllServices(): Promise<Service[]> {
        return await this.serviceRepository.find({
            relations: {
                category: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }


    async getServiceById(id: string): Promise<Service> {
        const service = await this.serviceRepository.findOne({
            where: { id },
            relations: {
                category: true,
            },
        });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        return service;
    }


    async updateService(
        id: string,
        updateServiceDto: UpdateServiceDto,
    ): Promise<Service> {
        const service = await this.serviceRepository.findOne({
            where: { id },
            relations: {
                category: true,
            },
        });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        if (updateServiceDto.name !== undefined) {
            const slug = slugify(updateServiceDto.name, {
                lower: true,
                strict: true,
            });

            const slugExists = await this.serviceRepository.findOne({
                where: { slug },
            });

            if (slugExists && slugExists.id !== id) {
                throw new BadRequestException('Slug already exists');
            }

            service.name = updateServiceDto.name;
            service.slug = slug;
        }

        if (updateServiceDto.description !== undefined) {
            service.description = updateServiceDto.description;
        }

        if (updateServiceDto.price !== undefined) {
            service.price = updateServiceDto.price;
        }

        if (updateServiceDto.duration !== undefined) {
            service.duration = updateServiceDto.duration;
        }

        if (updateServiceDto.isActive !== undefined) {
            service.isActive = updateServiceDto.isActive;
        }

        if (updateServiceDto.categoryId !== undefined) {
            const category = await this.categoryRepository.findOne({
                where: { id: updateServiceDto.categoryId },
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            service.category = category;
            service.categoryId = category.id;
        }

        return await this.serviceRepository.save(service);
    }



    async deleteService(id: string): Promise<{ message: string }> {
        const service = await this.serviceRepository.findOne({
            where: { id },
        });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        await this.serviceRepository.remove(service);

        return {
            message: 'Service deleted successfully',
        };
    }
}


