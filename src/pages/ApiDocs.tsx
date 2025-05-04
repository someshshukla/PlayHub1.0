import React, { useEffect, useRef } from "react";
import SwaggerUIBundle from "swagger-ui-dist/swagger-ui-bundle";
import "swagger-ui-dist/swagger-ui.css";
import { Header } from "@/components/Header";

const ApiDocs = () => {
  const swaggerUIRef = useRef<HTMLDivElement>(null);

  // API specification in OpenAPI format
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "PlayHub Manager API",
      version: "1.0.0",
      description: "API documentation for the PlayHub Manager application",
    },
    servers: [
      {
        url: window.location.origin,
        description: "Current environment",
      },
    ],
    tags: [
      {
        name: "Games",
        description: "Operations related to games management",
      },
    ],
    paths: {
      "/games": {
        get: {
          tags: ["Games"],
          summary: "Get all games",
          operationId: "getAllGames",
          responses: {
            "200": {
              description: "Successfully retrieved list of games",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Game",
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Games"],
          summary: "Create a new game",
          operationId: "createGame",
          requestBody: {
            description: "Game object to be added",
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NewGame",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Game created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Game",
                  },
                },
              },
            },
          },
        },
      },
      "/games/{id}": {
        get: {
          tags: ["Games"],
          summary: "Get a game by ID",
          operationId: "getGameById",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "ID of the game to retrieve",
            },
          ],
          responses: {
            "200": {
              description: "Successfully retrieved game",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Game",
                  },
                },
              },
            },
            "404": {
              description: "Game not found",
            },
          },
        },
        put: {
          tags: ["Games"],
          summary: "Update a game",
          operationId: "updateGame",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "ID of the game to update",
            },
          ],
          requestBody: {
            description: "Updated game object",
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NewGame",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Game updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Game",
                  },
                },
              },
            },
            "404": {
              description: "Game not found",
            },
          },
        },
        delete: {
          tags: ["Games"],
          summary: "Delete a game",
          operationId: "deleteGame",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "ID of the game to delete",
            },
          ],
          responses: {
            "204": {
              description: "Game deleted successfully",
            },
            "404": {
              description: "Game not found",
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Game: {
          type: "object",
          required: ["id", "name", "url", "author", "published_date"],
          properties: {
            id: {
              type: "string",
              description: "The unique identifier for a game",
            },
            name: {
              type: "string",
              description: "The name of the game",
            },
            url: {
              type: "string",
              description: "The URL to the game's website",
            },
            author: {
              type: "string",
              description: "The author or developer of the game",
            },
            published_date: {
              type: "string",
              format: "date-time",
              description: "The date when the game was published",
            },
          },
        },
        NewGame: {
          type: "object",
          required: ["name", "url", "author", "published_date"],
          properties: {
            name: {
              type: "string",
              description: "The name of the game",
            },
            url: {
              type: "string",
              description: "The URL to the game's website",
            },
            author: {
              type: "string",
              description: "The author or developer of the game",
            },
            published_date: {
              type: "string",
              format: "date-time",
              description: "The date when the game was published",
            },
          },
        },
      },
    },
  };

  useEffect(() => {
    if (swaggerUIRef.current) {
      SwaggerUIBundle({
        spec: spec,
        domNode: swaggerUIRef.current,
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pb-12">
        <h1 className="text-3xl font-bold mb-8 text-center">API Documentation</h1>
        
        <div className="bg-white rounded-lg shadow">
          <div ref={swaggerUIRef}></div>
        </div>
      </main>
    </div>
  );
};

export default ApiDocs;
