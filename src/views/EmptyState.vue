<template>
  <div class="max-w-3xl mx-auto h-full flex items-center justify-center flex-col space-y-6">
    <h1 class="text-center text-4xl font-bold text-red-600 mb-6">Error: {{ route.params.code }}</h1>

    <div class="space-y-4">
      <p class="text-xl text-center text-red-500">
        An error occurred while processing your request.
      </p>

      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="font-semibold mb-2">Error Code: {{ route.params.code }}</h2>
        <p class="mb-4">The following error was encountered:</p>
        <pre class="whitespace-pre-wrap text-gray-600">{{ route.params.message }}</pre>
      </div>

      <div class="bg-red-50 p-4 rounded-lg shadow-md">
        <h2 class="font-semibold mb-2">Explanation</h2>
        <ul class="list-disc pl-6 mb-4 text-red-500">
          <li>Verify that all required fields are filled in correctly.</li>
          <li>Check if the input format matches what's expected.</li>
          <li>Ensure you have the necessary permissions to access the resource.</li>
          <li>Possible issues with network connectivity or API endpoints.</li>
        </ul>
      </div> 

      <div class="bg-blue-50 p-4 rounded-lg shadow-md">
        <h2 class="font-semibold mb-2">Debugging Tips</h2>
        <ul class="list-disc pl-6 mb-4 text-blue-600">
          <li>Review the browser console for error messages.</li>
          <li>Check if there are any missing dependencies or misconfigured settings.</li>
          <li>Verify that all API calls are correctly formed and authorized.</li>
          <li>Use developer tools to inspect the response from the server.</li>
        </ul>
      </div>

      <button class="btn btn-success w-full justify-center" @click="$router.go(-1)">
        Go Back to Previous Page
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
