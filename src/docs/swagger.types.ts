export interface SwaggerTag {
  name: string;
  description?: string;
}

export interface SwaggerModule {
  tags?: SwaggerTag[];
  schemas?: Record<string, unknown>;
  paths?: Record<string, unknown>;
}
